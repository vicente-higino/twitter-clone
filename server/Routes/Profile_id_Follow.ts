import { Handler } from "express";
import { Profile, Follower } from "../DB/Database";

export const Profile_id_Follow: Handler = async (req, res) => {
  try {
    if (req.user) {
      const followerId = Number.parseInt(req.params.id);
      const profileId = req.user.profile.id;
      const profile = req.user.profile;
      const followerProfile = await Profile.findByPk(followerId);
      if (!followerProfile || profileId == followerId)
        throw new Error("Profile not found");
      const [follower, created] = await Follower.findOrCreate({
        where: { followerId },
        defaults: { followerId },
        include: [{ model: Profile, where: { id: profileId } }]
      });
      created && await profile.addFollower(follower);
      res.json(await profile.countFollowers());
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}
