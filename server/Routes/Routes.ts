import express from "express";
import * as routes from "./index";

export const router = express.Router();
export const privateRouter = express.Router();

export const isAuthenticated: express.Handler = (req, res, next) => {
    if (req.isAuthenticated()) {
        next('route');
    } else {
        res.status(401).json({ message: "You must login" })
    }
}

privateRouter.use(isAuthenticated);
privateRouter.get("/profile", routes.Profile);
privateRouter.get("/profile/:username", routes.ProfileUsername);
privateRouter.get("/myposts", routes.MyPosts);
privateRouter.get("/feed", routes.Feed);
privateRouter.post("/post", routes.Post);
privateRouter.delete("/post/:id", routes.RemovePost);
privateRouter.get("/myprofile/following", routes.MyProfile_Following);
privateRouter.get("/myprofile/followers", routes.MyProfile_Followers);
privateRouter.get("/profile/:id/follow", routes.Profile_id_Follow);
privateRouter.get("/profile/:id/unfollow", routes.Profile_id_Unfollow);
privateRouter.get("/post/:id/like", routes.Post_id_Like);
privateRouter.get("/post/:id/unlike", routes.Post_id_Unlike);
privateRouter.post("/saveimage", routes.SaveImage);
router.get("/logout", routes.Logout);
router.post("/signup", routes.SignUp);
router.post('/login', routes.Login);