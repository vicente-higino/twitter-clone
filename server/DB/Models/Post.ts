import {
  Model, DataTypes, Sequelize, CreationOptional, InferAttributes,
  InferCreationAttributes, Association, NonAttribute, HasManyCountAssociationsMixin, HasManyAddAssociationMixin
} from "sequelize";
import { Like } from "./Like";
import { Profile } from "./Profile";
export class Post extends Model<
  InferAttributes<Post>,
  InferCreationAttributes<Post>
> {
  declare id: CreationOptional<number>;
  declare text: string;
  declare images: string;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  public countLikes!: HasManyCountAssociationsMixin;
  public addLike!: HasManyAddAssociationMixin<Like, number>;
  public profile?: NonAttribute<Profile>;
  public likes?: NonAttribute<Like[]>;
  public static associations: {
    profile: Association<Profile, Post>;
    likes: Association<Like, Post>;
  };
}
export default (sequelize: Sequelize) => {
  Post.init({
    // attributes
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    text: {
      type: DataTypes.STRING(256),
      defaultValue: "",
      validate: {
        max: 256,
      }
    },
    images: {
      type: DataTypes.STRING(5000),
      defaultValue: "[]",
      get() {
        return JSON.parse(this.getDataValue("images"));
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
  }, {
    sequelize,
    modelName: 'post'
    // options
  });
  return Post;
}