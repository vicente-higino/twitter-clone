import pkg from "sequelize";
const { Model, DataTypes } = pkg;

export default (sequelize) => {
	class Profile extends Model { }
	Profile.init({
		// attributes
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: 'compositeIndex',
			validate: {
				len: [3, 20]
			},
			set(val) {
				this.setDataValue('username', val.toLowerCase());
			}
		},
		images: {
			type: DataTypes.STRING(50000),
			defaultValue: () => JSON.stringify(["/images/d6/65/d665e30acdb2f8dc519bb068760dd52a48ebf22a.jpg"]),
			set(val) {
				this.setDataValue('images', JSON.stringify(val));
			},
			get() {
				return JSON.parse(this.getDataValue('images'));
			}
		}
	}, {
		sequelize,
		modelName: 'profile'
		// options
	});
	return Profile;
}
