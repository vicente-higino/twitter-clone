import { Handler } from "express";
import { Post, Like, Profile } from "../DB/Database";

export const Post_id_Like: Handler = async (req, res) => {
  try {
    if (req.user) {
      const { id: postId } = req.params;
      const { id: profileId } = req.user.profile;
      const profile = req.user.profile;
      const post = await Post.findByPk(postId);
      if (!post)
        throw new Error("Post must be valide");
      let like = await Like.findOne({
        include: [
          { model: Post, where: { id: postId } },
          { model: Profile, where: { id: profileId } }],
      });
      if (!like) {
        like = await Like.create();
        await profile.addLike(like);
        await post.addLike(like);
      }
      res.json(await post.countLikes());
    }
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }

}
