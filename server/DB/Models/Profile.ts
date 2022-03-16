import { HasManyAddAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyRemoveAssociationMixin, NonAttribute } from "sequelize";
import { Model, DataTypes, Sequelize, CreationOptional, InferAttributes, InferCreationAttributes, Association } from "sequelize";
import { Follower } from "./Follower";
import { Like } from "./Like";
import { Post } from "./Post";
import { User } from "./User";

export class Profile extends Model<
	InferAttributes<Profile>,
	InferCreationAttributes<Profile>
> {
	declare id: CreationOptional<number>;
	declare username: string;
	declare images: CreationOptional<string>;
	declare readonly createdAt: CreationOptional<Date>;
	declare readonly updatedAt: CreationOptional<Date>;
	public createPost!: HasManyCreateAssociationMixin<Post>;
	public getPosts!: HasManyGetAssociationsMixin<Post>;
	public getFollowers!: HasManyGetAssociationsMixin<Follower>;
	public countFollowers!: HasManyCountAssociationsMixin;
	public addFollower!: HasManyAddAssociationMixin<Follower, number>;
	public removeFollower!: HasManyRemoveAssociationMixin<Follower, number>;
	public hasFollower!: HasManyHasAssociationMixin<Follower, number>;
	public addLike!: HasManyAddAssociationMixin<Like, number>;
	public user?: NonAttribute<User>;
	public posts?: NonAttribute<Post[]>;
	public followers?: NonAttribute<Follower[]>;
	public likes?: NonAttribute<Like[]>;
	public static associations: {
		user: Association<Profile, User>;
		posts: Association<Profile, Post>;
		followers: Association<Profile, Follower>;
		likes: Association<Profile, Like>;
	};
}
export default (sequelize: Sequelize) => {
	Profile.init({
		// attributes
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: 'compositeIndex',
			validate: {
				len: [3, 20]
			},
			set(val: string) {
				this.setDataValue('username', val.toLowerCase());
			}
		},
		images: {
			type: DataTypes.STRING(50000),
			defaultValue: () => JSON.stringify(["/images/d6/65/d665e30acdb2f8dc519bb068760dd52a48ebf22a.jpg"]),
			get() {
				return JSON.parse(this.getDataValue("images"));
			}
		},
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE
	}, {
		sequelize,
		modelName: 'profile'
		// options
	});
	return Profile;
}
