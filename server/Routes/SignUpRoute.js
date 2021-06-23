import { db, User, Profile } from "../DB/Database.js";

export async function SignUpRoute(req, res) {
  const { email, password, name } = req.body;
  let transaction;
  try {
    transaction = await db.transaction();
    const { id } = await User.create({ email, password }, { transaction });
    const profile = await Profile.create({ userId: id, username: name }, { transaction });
    transaction.commit();
    res.send(JSON.stringify(profile));
  } catch (error) {
    transaction.rollback();
    res.status(400).send("failed to create new user");
  }
}
