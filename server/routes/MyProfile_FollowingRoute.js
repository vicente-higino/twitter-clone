import { Profile, Follower } from "../database.js";

export async function MyProfile_FollowingRoute(req, res) {
  try {
    const { id: profileId } = req.user.profile;
    const follows = (await Follower.findAll({
      attributes: ['followerId'],
      where: {
        profileId
      }
    })).map((follow) => follow.getDataValue("followerId"));
    const following = await Profile.findAll({
      attributes: ['username', 'images'],
      where: {
        id: {
          [Op.in]: follows
        }
      }
    });
    res.json(following);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}
