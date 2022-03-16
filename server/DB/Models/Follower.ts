import { Model, DataTypes, Sequelize, Association, CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { Profile } from "./Profile";
export class Follower extends Model<
    InferAttributes<Follower>,
    InferCreationAttributes<Follower>
> {
    declare id: CreationOptional<number>;
    declare followerId: number;
    declare readonly createdAt: CreationOptional<Date>;
    declare readonly updatedAt: CreationOptional<Date>;
    public profile?: NonAttribute<Profile>;
    public static associations: {
        profile: Association<Profile, Follower>;
    };
}
export default (sequelize: Sequelize) => {
    Follower.init({
        // attributes
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        followerId: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'follower'
        // options
    });
    return Follower;
}