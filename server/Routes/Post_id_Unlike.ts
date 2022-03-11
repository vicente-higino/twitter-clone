import { Handler } from "express";
import { db, Like, Post, Profile } from "../DB/Database";

export const Post_id_Unlike: Handler = async (req, res) => {
  let transaction;
  try {
    if (req.user) {
      transaction = await db.transaction();
      const { id: postId } = req.params;
      const { id: profileId } = req.user.profile;
      const like = await Like.findOne({
        include: [
          { model: Profile, where: { id: profileId } },
          { model: Post, where: { id: postId } },
        ]
      })
      await like?.destroy();
      await transaction.commit();
      res.json(await Like.count({
        include: [
          { model: Post, where: { id: postId } },
        ]
      }));
    }
  } catch (error) {
    console.log(error);
    transaction && transaction.rollback();
    res.status(400).json({ message: "Something went wrong" });
  }

}
