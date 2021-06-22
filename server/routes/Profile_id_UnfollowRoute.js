import { db, Follower } from "../database.js";

export async function Profile_id_UnfollowRoute(req, res) {
  let transaction;
  try {
    transaction = await db.transaction();
    const { id: followerId } = req.params;
    const { id: profileId } = req.user.profile;
    await Follower.destroy({ where: { followerId, profileId } }, { transaction });
    await transaction.commit();
    res.json(await Follower.count({ where: { profileId } }));
  } catch (error) {
    console.log(error);
    transaction.rollback();
    res.status(400).json({ message: "Something went wrong" });
  }
}
