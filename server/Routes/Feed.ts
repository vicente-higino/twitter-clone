import { Profile, Post, Like } from "../DB/Database.js";
import { Op } from 'sequelize';
import { Handler } from "express";
export const Feed: Handler = async (req, res) => {
  let { limit, offset, time } = req.query as any;
  if (req.user) {
    const profile = await req.user.getProfile();
    const profileId = profile.id as number;
    const followers = [profileId, ...(await profile.getFollowers()).map((follower => follower.followerId))];
    const feed = await (Post.findAll({
      include: [
        {
          model: Profile, attributes: ['username', 'images'], where: {
            id: {
              [Op.in]: followers
            }
          }
        },
        { model: Like, include: [{ model: Profile, attributes: ['username', 'images'] }], attributes: ['profileId'] }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      where: {
        createdAt: {
          [Op.lte]: time || new Date()
        }
      }
    }));
    res.json({ feed });
  }
}
