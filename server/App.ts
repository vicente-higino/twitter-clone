import express from "express";
import passport from "passport";
import { config } from "./Auth/auth";
import cors from 'cors';
import { isAuthenticated, privateRouter, router } from "./Routes/Routes";
import SessionConfig from "./Auth/SessionConfig";

const app = express();
config(passport);
app.use(cors())
app.use(SessionConfig);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.query({}));
app.use(express.json());
app.use(express.raw({ type: 'application/octet-stream', limit: 1024 * 1024 * 1024 }));
app.use('/images', isAuthenticated);
app.use('/images', express.static('./images'));
app.use(router);
app.use(privateRouter);
app.listen(5000);
console.log("Listening");

// import { Op } from "sequelize";
// import { Profile } from "./DB/Database";
// import { Post } from "./DB/Models/Post";

// (async () => {
//     // console.log((await Post.create({ text: "oi", images: JSON.stringify(["teste", "testeee"]) })).id);
//     // const users = await Profile.findAll({ include: [Post] });
//     // for (const { username, posts } of users) {
//     //     if (posts) {
//     //         for (const post of posts) {
//     //             console.log(username, post.text);
//     //         }
//     //     }
//     // }

//     const profile = await Profile.findOne({ where: { username: "vicente" } });
//     if (profile) {
//         const followersids = (await profile.getFollowers()).map((f) => f.followerId);
//         const followers = (await Profile.findAll({
//             where: {
//                 id: followersids
//             }
//         })).map((f) => f.username)
//         console.log(followers);

//         // const posts = await profile.getPosts({ include: [Profile] });
//         // for (const post of posts) {
//         //     console.log(await post.countLikes());

//         // }
//     }

//     // const post = await profile?.createPost({ text: "teste", images: "[teste]" });
//     // console.log(post?.id);



// })();
