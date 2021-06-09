import pkg from "sequelize";
const { Model, DataTypes } = pkg;
export default (sequelize) => {
	class Post extends Model { }
	Post.init({
		// attributes
		text: {
			type: DataTypes.STRING(256),
			validate: {
				max: [256],
				allowNullIfHasImage(value) {
					if (value === null && this.images.length == 0) {
						throw new Error("text can't be null unless has a image");
					}
				}
			}
		},
		images: {
			type: DataTypes.STRING(50000),
			set(val) {
				this.setDataValue('images', JSON.stringify(val));
			},
			get() {
				return JSON.parse(this.getDataValue('images'));
			}
		},

	}, {
		sequelize,
		modelName: 'post'
		// options
	});
	return Post;
}