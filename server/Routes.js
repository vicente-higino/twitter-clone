import express from "express";
import * as routes from "./routes/index.js";

export const router = express.Router();
export const privateRouter = express.Router();

export function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next('route');
    } else {
        res.status(401).json({ message: "You must login" })
    }
}

privateRouter.use(isAuthenticated);
privateRouter.get("/profile", routes.ProfileRoute);
privateRouter.get("/profile/:username", routes.ProfileUsernameRoute);
privateRouter.get("/myposts", routes.MyPostsRoute);
privateRouter.get("/feed", routes.FeedRoute);
privateRouter.post("/post", routes.PostRoute);
privateRouter.get("/myprofile/following", routes.MyProfile_FollowingRoute);
privateRouter.get("/myprofile/followers", routes.MyProfile_FollowersRoute);
privateRouter.get("/profile/:id/follow", routes.Profile_id_FollowRoute);
privateRouter.get("/profile/:id/unfollow", routes.Profile_id_UnfollowRoute);
privateRouter.get("/post/:id/like", routes.Post_id_LikeRoute);
privateRouter.get("/post/:id/unlike", routes.Post_id_UnlikeRoute);
privateRouter.post("/saveimage", routes.SaveImageRoute);
router.get("/logout", routes.LogoutRoute);
router.post("/signup", routes.SignUpRoute);
router.post('/login', routes.LoginRoute);