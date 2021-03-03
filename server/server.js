import express from "express";
import passport from "passport";
import bodyparser from "body-parser"
import session from "express-session";
import { config } from "./auth.js";
import { User, Profile, Post } from "./database.js";
import cors from 'cors';
const app = express();
const router = express.Router();
const privateRouter = express.Router();
config(passport);
app.use(cors())
app.use(session({
  secret: 'VicenteHigino99',//configure um segredo seu aqui,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 }//30min
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ extended: true }));

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next('route');
  } else {
    res.status(401).json({ message: "You must login" })
  }
}
privateRouter.use(isAuthenticated);

privateRouter.get("/profile", async (req, res) => {
  const { username } = req.user.profile;
  res.json({ username });
});

privateRouter.get("/profile/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const { id } = await Profile.findOne({ where: { username } });
    const texts = await Post.findAll({ include: [Profile], order: [['createdAt', 'DESC']], where: { profileId: id } });
    res.json({ texts });
  } catch (error) {
    res.status(404).json({ message: "User not found!" });
  }
});

privateRouter.get("/myposts", async (req, res) => {
  const { id: profileId } = req.user.profile;
  const texts = await (Post.findAll({ include: [Profile], order: [['createdAt', 'DESC']], where: { profileId } }));
  res.json({ texts });
});

privateRouter.get("/feed", async (req, res) => {
  const texts = await (Post.findAll({
    include: [Profile],
    order: [['createdAt', 'DESC']]
  }));
  res.json({ feed: texts });
});

privateRouter.post("/post", async (req, res) => {
  const { text } = req.body;
  const { id: profileId } = req.user.profile;
  const { createdAt } = await Post.create({ text, profileId });
  res.json({ createdAt });
});

router.get("/logout", async (req, res) => {
  await req.logOut();
  res.send("ok");
})

router.post('/login', function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.send("ok");
  } else {
    next();
  }
});

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const { id } = await User.create({ email, password });
    const profile = await Profile.create({ userId: id, username: name });
    res.send(JSON.stringify(profile));
  } catch (error) {
    res.status(400).send("failed to create new user");
  }
});
router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.send("fail") }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      return res.send("ok");
    });
  })(req, res, next)
});
app.use(router);
app.use(privateRouter);
app.listen(5000);