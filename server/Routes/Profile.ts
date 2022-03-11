import { Handler } from "express";
export const Profile: Handler = async (req, res) => {
  if (req.user) {
    const { username } = await req.user.getProfile();
    res.json({ username });
  } else {
    res.status(401).json({ message: "You must login" });
  }
}
