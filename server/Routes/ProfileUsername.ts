import { Profile, Like, Follower } from "../DB/Database";
import { Handler } from "express";

export const ProfileUsername: Handler = async (req, res) => {
  try {
    const { username } = req.params;
    const profile = await Profile.findOne({ where: { username } });
    if (profile && req.user) {
      const { id, images } = profile;
      const texts = await profile.getPosts({
        include: [
          { model: Profile, attributes: ['username', 'images'] },
          { model: Like, include: [{ model: Profile, attributes: ['username', 'images'] }], attributes: ['profileId'] }
        ],
        order: [['createdAt', 'DESC']],
      });
      const followers = await Follower.count({ where: { followerId: id } });
      const follows = await profile.countFollowers();
      const myProfile = req.user.profile;
      const following = (await Follower.findOne({
        where: { followerId: id },
        include: [{ model: Profile, where: { id: myProfile.id } }]
      })) ? true : false;
      res.json({ profile: { id, username, images, following, followers, follows }, texts });
    } else {
      res.status(404).json({ message: "User not found!" });
    }
  } catch (error) {
    res.status(404).json({ message: "User not found!" });
  }
}
