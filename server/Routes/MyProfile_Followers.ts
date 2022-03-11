import { Handler } from "express";
import { Profile, Follower } from "../DB/Database";

export const MyProfile_Followers: Handler = async (req, res) => {
  try {
    if (req.user) {
      const profile = await req.user.getProfile();
      const follows = await Follower.findAll({
        where: { followerId: profile.id }, include: [
          { model: Profile, attributes: ['username', 'images'] },
        ]
      });
      // const follows = await profile.getFollowers({
      //   include: [
      //     { model: Profile, attributes: ['username', 'images'] },
      //   ],
      // });
      res.json(follows);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}
