import { db, Profile, Follower } from "../DB/Database.js";

export async function Profile_id_FollowRoute(req, res) {
  let transaction;
  try {
    transaction = await db.transaction();
    const { id: followerId } = req.params;
    const { id: profileId } = req.user.profile;
    if (!await Profile.findByPk(followerId) || profileId == followerId)
      throw new Error("Profile id not found");
    await Follower.findOrCreate({ where: { followerId, profileId }, defaults: { followerId, profileId }, transaction });
    await transaction.commit();
    res.json(await Follower.count({ where: { profileId } }));
  } catch (error) {
    console.log(error);
    transaction.rollback();
    res.status(400).json({ message: "Something went wrong" });
  }
}
