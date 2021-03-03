import Sequelize from "sequelize";
import bcrypt from "bcryptjs";

export const sequelize = new Sequelize('postgres://vicente:VicenteHigino99@localhost:5432/twitter-clone');
const Model = Sequelize.Model;
export class User extends Model { }
User.init({
	// attributes

	email: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: 'compositeIndex',
		validate: {
			isEmail: true
		}
	},
	password: {
		type: Sequelize.DataTypes.STRING,
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
export class Profile extends Model { }
Profile.init({
	// attributes
	username: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: 'compositeIndex',
		validate: {
			len: [3, 20]
		},
		set(val) {
			this.setDataValue('username', val.toLowerCase());
		}
	}
}, {
	sequelize,
	modelName: 'profile'
	// options
});
export class Post extends Model { }
Post.init({
	// attributes
	text: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 256]
		}
	}
}, {
	sequelize,
	modelName: 'post'
	// options

});
User.hasOne(Profile);
Profile.belongsTo(User);
Profile.hasMany(Post);
Post.belongsTo(Profile);
sequelize
	.authenticate()
	.then(async () => {
		await sequelize.sync();
		// const { id } = await User.create({ email: "vi_higino@hotmail.com.br", password: "Vicente99" });
		// await Profile.create({ userId: id, username: "Vicente Higino" });

		console.log(JSON.stringify(await User.findAll({ include: [Profile] })));
		console.log('Connection has been established successfully.');
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err);
	});
// User.create({username:"Vicente",email:"vi_higino@hotmail.com.br",password:"Vicente99"})
