import { Handler } from "express";
import { db, User } from "../DB/Database.js";

export const SignUp: Handler = async (req, res) => {
  const { email, password, name } = req.body;
  let transaction;
  try {
    transaction = await db.transaction();
    const user = await User.create({ email, password }, { transaction });
    const profile = await user.createProfile({ username: name }, { transaction });
    await transaction.commit();
    res.json(profile.toJSON());
  } catch (error) {
    transaction && await transaction.rollback();
    res.status(400).send("failed to create new user");
  }
}
