import { Profile, Post, Like } from "../DB/Database.js";

export async function MyPostsRoute(req, res) {
  const { id: profileId } = req.user.profile;
  const texts = await (Post.findAll({
    include: [
      { model: Profile, attributes: ['username', 'images'] },
      { model: Like, include: [{ model: Profile, attributes: ['username', 'images'] }], attributes: ['profileId'] }
    ],
    order: [['createdAt', 'DESC']],
    where: { profileId }
  }));
  res.json({ texts });
}
