import { Profile, Post, Like, Follower } from "../DB/Database.js";
import pkg from 'sequelize';
const { Op } = pkg;

export async function FeedRoute(req, res) {
  const { limit, offset, time } = req.query;
  const { id: profileId } = req.user.profile;
  const followers = (await Follower.findAll({ attributes: ['followerId'], where: { profileId } })).map((follower => follower.getDataValue("followerId")));
  followers.push(profileId);
  const texts = await (Post.findAll({
    include: [
      { model: Profile, attributes: ['username', 'images'] },
      { model: Like, include: [{ model: Profile, attributes: ['username', 'images'] }], attributes: ['profileId'] }
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
    where: {
      profileId: {
        [Op.in]: followers
      },
      createdAt: {
        [Op.lte]: time || new Date().toISOString()
      }
    }
  }));
  res.json({ feed: texts });
}
