import { Profile, Post, Like, Follower } from "../DB/Database.js";

export async function ProfileUsernameRoute(req, res) {
  try {
    const { username } = req.params;
    const { id, images } = await Profile.findOne({ where: { username } });
    const texts = await Post.findAll({
      include: [
        { model: Profile, attributes: ['username', 'images'] },
        { model: Like, include: [{ model: Profile, attributes: ['username', 'images'] }], attributes: ['profileId'] }
      ],
      order: [['createdAt', 'DESC']],
      where: { profileId: id }
    });
    const followers = await Follower.count({ where: { followerId: id } });
    const follows = await Follower.count({ where: { profileId: id } });
    const following = (await Follower.findOne({ where: { followerId: id, profileId: req.user.profile.id } })) ? true : false;
    res.json({ profile: { id, username, images, following, followers, follows }, texts });
  } catch (error) {
    res.status(404).json({ message: "User not found!" });
  }
}
