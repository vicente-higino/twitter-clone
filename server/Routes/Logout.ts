import { Handler } from "express";

export const Logout: Handler = async (req, res) => {
  req.logOut();
  res.send("ok");
}
