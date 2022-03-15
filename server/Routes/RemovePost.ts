import { Handler } from "express";
import { Post, Profile, Like } from "../DB/Database.js";

export const RemovePost: Handler = async (req, res) => {
  try {
    if (req.user) {
      const { id } = req.params;
      const { profile } = req.user;
      const post = await Post.findByPk(id, { include: [{ model: Profile }, { model: Like }] });
      if (post) {
        if (post.profile?.id == profile.id) {
          post.destroy();
          res.json({ message: "success" });
        } else {
          res.status(403).json({ message: "Not authorized" });
        }
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }

}
