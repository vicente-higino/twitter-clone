import express from "express";
import passport from "passport";
import bodyparser from "body-parser"
import session from "express-session";
import persist_session_pg from "connect-pg-simple";
const pgSession = persist_session_pg(session);
import { config } from "./auth.js";
import { db, User, Profile, Post, Like, Follower } from "./database.js";
import pkg from 'sequelize';
const { Op } = pkg;
const { Sequelize } = pkg;
import fs from "fs";
import path from "path";
import crypto from "crypto";
import cors from 'cors';
import FileType from 'file-type';
import dbSessionConfig from "./DBSession.js";
dbSessionConfig();
const app = express();
const router = express.Router();
const privateRouter = express.Router();
config(passport);
app.use(cors())
app.use(session({
  store: new pgSession({
    conString: 'postgres://admin:xTMYCxJv7hPw2NocSn4sAZbL9@db:5432/twitter-clone',
  }),
  secret: '80j3d8ja8sjd83nadsadj3ij',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 * 24 * 7 } //1 week
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(express.raw({ type: 'application/octet-stream', limit: '20mb' }));

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next('route');
  } else {
    res.status(401).json({ message: "You must login" })
  }
}
app.use('/images', isAuthenticated);
app.use('/images', express.static('./images'));
privateRouter.use(isAuthenticated);

privateRouter.get("/profile", async (req, res) => {
  const { username } = req.user.profile;
  res.json({ username });
});

privateRouter.get("/profile/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const { id } = await Profile.findOne({ where: { username } });
    const texts = await Post.findAll({
      include: [
        { model: Profile, attributes: ['username', 'images'] },
        { model: Like, include: [{ model: Profile, attributes: ['username', 'images'] }], attributes: ['profileId'] }
      ],
      order: [['createdAt', 'DESC']],
      where: { profileId: id }
    });
    res.json({ texts });
  } catch (error) {
    res.status(404).json({ message: "User not found!" });
  }
});

privateRouter.get("/myposts", async (req, res) => {
  const { id: profileId } = req.user.profile;
  const texts = await (Post.findAll({
    include: [
      { model: Profile, attributes: ['username', 'images'] },
      { model: Like, include: [{ model: Profile, attributes: ['username', 'images'] }], attributes: ['profileId'] }
    ],
    order: [['createdAt', 'DESC']],
    where: { profileId }
  }));
  res.json({ texts });
});

privateRouter.get("/feed", async (req, res) => {
  const { limit, offset, time } = req.query;
  const { id: profileId } = req.user.profile;
  const followers = (await Follower.findAll({ attributes: ['followerId'], where: { profileId } })).map((follower => follower.getDataValue("followerId")));
  followers.push(profileId);
  const texts = await (Post.findAll({
    include: [
      { model: Profile, attributes: ['username', 'images'] },
      { model: Like, include: [{ model: Profile, attributes: ['username', 'images'] }], attributes: ['profileId'] }
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
    where: {
      profileId: {
        [Op.in]: followers
      },
      createdAt: {
        [Op.lte]: time || new Date().toISOString()
      }
    }
  }));
  res.json({ feed: texts });
});

privateRouter.post("/post", async (req, res) => {
  try {
    const { text, images } = req.body;
    const { id: profileId } = req.user.profile;
    const { createdAt } = await Post.create({ text, images, profileId });
    res.json({ createdAt });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }

});

privateRouter.get("/myprofile/following", async (req, res) => {
  try {
    const { id: profileId } = req.user.profile;
    const follows = (await Follower.findAll({
      attributes: ['followerId'],
      where: {
        profileId
      }
    })).map((follow) => follow.getDataValue("followerId"));
    const following = await Profile.findAll({
      attributes: ['username', 'images'],
      where: {
        id: {
          [Op.in]: follows
        }
      }
    })
    res.json(following);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong" });
  }
});
privateRouter.get("/myprofile/followers", async (req, res) => {
  try {
    const { id: profileId } = req.user.profile;
    const follows = await Follower.findAll({
      attributes: ['profileId'],
      include: [
        { model: Profile, attributes: ['username', 'images'] },
      ],
      where: {
        followerId: profileId
      }
    });
    res.json(follows);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong" });
  }
});

privateRouter.get("/profile/:id/follow", async (req, res) => {
  let transaction;
  try {
    transaction = await db.transaction();
    const { id: followerId } = req.params;
    const { id: profileId } = req.user.profile;
    if (!await Profile.findByPk(followerId) || profileId == followerId) throw new Error("Profile id not found");
    await Follower.findOrCreate({ where: { followerId, profileId }, defaults: { followerId, profileId }, transaction });
    await transaction.commit();
    res.json(await Follower.count({ where: { profileId } }));
  } catch (error) {
    console.log(error);
    transaction.rollback();
    res.status(400).json({ message: "Something went wrong" });
  }
});
privateRouter.get("/profile/:id/unfollow", async (req, res) => {
  let transaction;
  try {
    transaction = await db.transaction();
    const { id: followerId } = req.params;
    const { id: profileId } = req.user.profile;
    await Follower.destroy({ where: { followerId, profileId } }, { transaction });
    await transaction.commit();
    res.json(await Follower.count({ where: { profileId } }));
  } catch (error) {
    console.log(error);
    transaction.rollback();
    res.status(400).json({ message: "Something went wrong" });
  }
});
privateRouter.get("/post/:id/like", async (req, res) => {
  let transaction;
  try {
    transaction = await db.transaction();
    const { id: postId } = req.params;
    const { id: profileId } = req.user.profile;
    if (!await Post.findByPk(postId)) throw new Error("Post must be valide");
    await Like.findOrCreate({ where: { postId, profileId }, defaults: { postId, profileId }, transaction });
    await transaction.commit();
    res.json(await Like.count({ where: { postId } }));
  } catch (error) {
    console.log(error);
    transaction.rollback();
    res.status(400).json({ message: "Something went wrong" });
  }

});
privateRouter.get("/post/:id/unlike", async (req, res) => {
  let transaction;
  try {
    transaction = await db.transaction();
    const { id: postId } = req.params;
    const { id: profileId } = req.user.profile;
    await Like.destroy({ where: { postId, profileId } }, { transaction });
    await transaction.commit();
    res.json(await Like.count({ where: { postId } }));
  } catch (error) {
    console.log(error);
    transaction.rollback();
    res.status(400).json({ message: "Something went wrong" });
  }

});
privateRouter.post("/saveimage", async (req, res) => {
  try {
    if (!req.body.length) {
      throw new Error("No image");
    }
    const { ext, mime } = await FileType.fromBuffer(req.body);
    const text = await req.body;
    const name = crypto.createHash("SHA1").update(text).digest('hex');
    const firtPart = "./images/" + name.substr(0, 2);
    const secondPart = firtPart + "/" + name.substr(2, 2) + "/";
    const imagePath = path.join(secondPart, name + "." + ext);
    if (!fs.existsSync("./images")) fs.mkdirSync("./images");
    if (!fs.existsSync(firtPart)) fs.mkdirSync(firtPart);
    if (!fs.existsSync(secondPart)) fs.mkdirSync(secondPart);
    fs.writeFileSync(imagePath, text);
    res.json({ url: "/" + imagePath, type: mime });
  } catch (error) {
    res.status(400).json({ message: "Image coud not be saved!" })
  }
});

router.get("/logout", async (req, res) => {
  req.logOut();
  res.send("ok");
})

router.post('/login', function (req, res, next) {
  if (req.isAuthenticated()) {
    const { username } = req.user.profile;
    res.json({ username });
  } else {
    next();
  }
});

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  let transaction;
  try {
    transaction = await db.transaction();
    const { id } = await User.create({ email, password }, { transaction });
    const profile = await Profile.create({ userId: id, username: name }, { transaction });
    transaction.commit();
    res.send(JSON.stringify(profile));
  } catch (error) {
    transaction.rollback();
    res.status(400).send("failed to create new user");
  }
});
router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.status(401).send("fail") }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      const { username } = user.profile;
      return res.json({ username });
    });
  })(req, res, next)
});
app.use(router);
app.use(privateRouter);
app.listen(5000);