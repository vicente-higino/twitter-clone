import { Handler } from "express";
import { Post as P, Profile, Like } from "../DB/Database.js";

export const Post: Handler = async (req, res) => {
  try {
    if (req.user) {
      const { text, images } = req.body;
      const { profile } = req.user;
      const { id } = await profile.createPost({ text, images: JSON.stringify(images) });
      const post = await (P.findByPk(id, {
        include: [
          { model: Profile, attributes: ['username', 'images'] },
          { model: Like, include: [{ model: Profile, attributes: ['username', 'images'] }], attributes: ['profileId'] }
        ],
      }));
      res.json({ post });
    }
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }

}
