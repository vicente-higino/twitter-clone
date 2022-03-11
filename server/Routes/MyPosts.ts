import { Handler } from "express";
import { Profile, Like } from "../DB/Database.js";

export const MyPosts: Handler = async (req, res) => {
  if (req.user) {
    const profile = await req.user.getProfile();
    const texts = await profile.getPosts({
      include: [
        { model: Profile, attributes: ['username', 'images'] },
        { model: Like, include: [{ model: Profile, attributes: ['username', 'images'] }], attributes: ['profileId'] }
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json({ texts });
  }
}
