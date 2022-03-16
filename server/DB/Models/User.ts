import bcrypt from "bcryptjs";
import { Model, DataTypes, Sequelize, CreationOptional, InferAttributes, InferCreationAttributes, Association, NonAttribute, BelongsToGetAssociationMixin, BelongsToCreateAssociationMixin } from "sequelize";
import { Profile } from "./Profile";

export class User extends Model<
	InferAttributes<User>,
	InferCreationAttributes<User>
> {
	declare id: CreationOptional<number>;
	declare email: string;
	declare password: string;
	declare readonly createdAt: CreationOptional<Date>;
	declare readonly updatedAt: CreationOptional<Date>;
	public getProfile!: BelongsToGetAssociationMixin<Profile>;
	public createProfile!: BelongsToCreateAssociationMixin<Profile>;
	public profile!: NonAttribute<Profile>;
	public static associations: {
		profile: Association<Profile, User>;
	};
}
export default (sequelize: Sequelize) => {
	User.init({
		// attributes
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: 'compositeIndex',
			validate: {
				isEmail: true
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			set(password: string) {
				this.password = bcrypt.hashSync(password);
			},
			validate: {
				len: [8, 64]
			}
		},
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	}, {
		sequelize,
		modelName: 'user'
		// options
	});
	return User;
}