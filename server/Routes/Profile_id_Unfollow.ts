import { Handler } from "express";

export const Profile_id_Unfollow: Handler = async (req, res) => {
  try {
    if (req.user) {
      const followerId = Number.parseInt(req.params.id);
      const profile = req.user.profile;
      const [follower] = await profile.getFollowers({ where: { followerId } });
      profile.removeFollower(followerId);
      await follower?.destroy();
      res.json(await profile.countFollowers());
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}
