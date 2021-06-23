import pkg from "sequelize";
const { Model, DataTypes } = pkg;
export default (sequelize) => {
    class Like extends Model { }
    Like.init({
        // attributes
        likeType: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
    }, {
        sequelize,
        modelName: 'like'
        // options
    });
    return Like;
}