import Sequelize from "sequelize";
import user from "./User.js"
import post from "./Post.js"
import profile from "./Profile.js"
const db = new Sequelize('postgres://vicente:VicenteHigino99@localhost:5432/twitter-clone');

export const Post = post(db);
export const User = user(db);
export const Profile = profile(db);

User.hasOne(Profile);
Profile.belongsTo(User);
Profile.hasMany(Post);
Post.belongsTo(Profile);

db
  .authenticate()
  .then(async () => {
    await db.sync({ alter: true });
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });