import { Post } from "../database.js";

export async function PostRoute(req, res) {
  try {
    const { text, images } = req.body;
    const { id: profileId } = req.user.profile;
    const { createdAt } = await Post.create({ text, images, profileId });
    res.json({ createdAt });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }

}
