import { Handler } from "express";
import { Op } from "sequelize";
import { Profile, Follower } from "../DB/Database.js";

export const MyProfile_Following: Handler = async (req, res) => {
  try {
    if (req.user) {
      const { id } = await req.user.getProfile();
      const follows = (await Follower.findAll({
        attributes: ['followerId'],
        include: [
          {
            model: Profile, attributes: ['username', 'images'], where: {
              id
            }
          },
        ],

      })).map((follow) => follow.followerId);
      const following = await Profile.findAll({
        attributes: ['username', 'images'],
        where: {
          id: {
            [Op.in]: follows
          }
        }
      });
      res.json(following);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}
