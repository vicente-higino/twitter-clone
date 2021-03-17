import bcrypt from "bcryptjs";
import pkg from "sequelize";
const { Model, DataTypes } = pkg;

export default (sequelize) => {
	class User extends Model { }
	User.init({
		// attributes
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
			set(password) {
				this.setDataValue("password", bcrypt.hashSync(password));
			},
			validate: {
				len: [8, 64]
			}
		}
	}, {
		sequelize,
		modelName: 'user'
		// options
	});
	return User;
}