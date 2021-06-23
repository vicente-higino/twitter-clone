import pkg from "sequelize";
const { Model, DataTypes } = pkg;
export default (sequelize) => {
    class Follower extends Model { }
    Follower.init({
        // attributes
        followerId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'follower'
        // options
    });
    return Follower;
}