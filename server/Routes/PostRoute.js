import { Post, Profile, Like, Follower } from "../DB/Database.js";

export async function PostRoute(req, res) {
  try {
    const { text, images } = req.body;
    const { id: profileId } = req.user.profile;
    const { id } = await Post.create({ text, images, profileId });
    const followers = (await Follower.findAll({ attributes: ['followerId'], where: { profileId } }))
      .map((follower => follower.getDataValue("followerId")));
    followers.push(profileId);
    const post = await (Post.findByPk(id, {
      include: [
        { model: Profile, attributes: ['username', 'images'] },
        { model: Like, include: [{ model: Profile, attributes: ['username', 'images'] }], attributes: ['profileId'] }
      ],
    }));
    res.json({ post });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }

}
