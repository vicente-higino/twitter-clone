import { Profile, Follower } from "../database.js";

export async function MyProfile_FollowersRoute(req, res) {
  try {
    const { id: profileId } = req.user.profile;
    const follows = await Follower.findAll({
      attributes: ['profileId'],
      include: [
        { model: Profile, attributes: ['username', 'images'] },
      ],
      where: {
        followerId: profileId
      }
    });
    res.json(follows);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}
