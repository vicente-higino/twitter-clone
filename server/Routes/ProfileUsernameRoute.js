import { Profile, Post, Like } from "../DB/Database.js";

export async function ProfileUsernameRoute(req, res) {
  try {
    const { username } = req.params;
    const { id } = await Profile.findOne({ where: { username } });
    const texts = await Post.findAll({
      include: [
        { model: Profile, attributes: ['username', 'images'] },
        { model: Like, include: [{ model: Profile, attributes: ['username', 'images'] }], attributes: ['profileId'] }
      ],
      order: [['createdAt', 'DESC']],
      where: { profileId: id }
    });
    res.json({ texts });
  } catch (error) {
    res.status(404).json({ message: "User not found!" });
  }
}
