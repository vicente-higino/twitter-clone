import { db, Like } from "../DB/Database.js";

export async function Post_id_UnlikeRoute(req, res) {
  let transaction;
  try {
    transaction = await db.transaction();
    const { id: postId } = req.params;
    const { id: profileId } = req.user.profile;
    await Like.destroy({ where: { postId, profileId } }, { transaction });
    await transaction.commit();
    res.json(await Like.count({ where: { postId } }));
  } catch (error) {
    console.log(error);
    transaction.rollback();
    res.status(400).json({ message: "Something went wrong" });
  }

}
