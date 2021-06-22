import { db, Post, Like } from "../database.js";

export async function Post_id_LikeRoute(req, res) {
  let transaction;
  try {
    transaction = await db.transaction();
    const { id: postId } = req.params;
    const { id: profileId } = req.user.profile;
    if (!await Post.findByPk(postId))
      throw new Error("Post must be valide");
    await Like.findOrCreate({ where: { postId, profileId }, defaults: { postId, profileId }, transaction });
    await transaction.commit();
    res.json(await Like.count({ where: { postId } }));
  } catch (error) {
    console.log(error);
    transaction.rollback();
    res.status(400).json({ message: "Something went wrong" });
  }

}
