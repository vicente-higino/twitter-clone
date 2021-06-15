import Sequelize from "sequelize";
import user from "./User.js"
import post from "./Post.js"
import profile from "./Profile.js"
import like from "./Like.js"
import follower from "./Follower.js"

// export const db = new Sequelize('postgres://vicente:VicenteHigino99@192.168.1.10:5432/twitter-clone');

export const db = new Sequelize('postgres://admin:xTMYCxJv7hPw2NocSn4sAZbL9@db:5432/twitter-clone');

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
Post.hasMany(Like);
Like.belongsTo(Post);
Like.belongsTo(Profile);


(async () => {
  while (true) {
    try {
      await db.authenticate();
      await db.sync({ alter: true });
      console.log('Connection has been established successfully.');
      break;
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
})();
