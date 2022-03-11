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
        modelName: 'follower'
        // options
    });
    return Follower;
}