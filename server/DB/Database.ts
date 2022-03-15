import { Options, Sequelize } from "sequelize";
import user from "./Models/User"
import post from "./Models/Post"
import profile from "./Models/Profile"
import like from "./Models/Like"
import follower from "./Models/Follower"
import { config } from "dotenv";
config();
const db_connection: Options = {
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  dialect: 'postgres',
  logging: false
};

export const db = new Sequelize(db_connection);

export const Post = post(db);

export const User = user(db);
export const Profile = profile(db);
export const Like = like(db);
export const Follower = follower(db);
User.hasOne(Profile);
Profile.belongsTo(User);
Profile.hasMany(Post);
Profile.hasMany(Like);
Profile.hasMany(Follower);
Follower.belongsTo(Profile);
Post.belongsTo(Profile);
Post.hasMany(Like, { onDelete: "CASCADE" });
Like.belongsTo(Post);
Like.belongsTo(Profile);
(async () => {
  while (true) {
    try {
      await db.authenticate();
      await db.sync();
      console.log('Connection has been established successfully.');
      break;
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
})();
