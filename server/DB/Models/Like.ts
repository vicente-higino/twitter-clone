import { Model, DataTypes, Sequelize, Association, CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { Post } from "./Post";
import { Profile } from "./Profile";
export class Like extends Model<
    InferAttributes<Like>,
    InferCreationAttributes<Like>
> {
    declare id: CreationOptional<number>;
    declare likeType?: number;
    declare readonly createdAt: CreationOptional<Date>;
    declare readonly updatedAt: CreationOptional<Date>;
    public post?: NonAttribute<Post>;
    public profile?: NonAttribute<Profile>;
    public static associations: {
        post: Association<Post, Like>;
        profile: Association<Profile, Like>;
    };
}
export default (sequelize: Sequelize) => {
    Like.init({
        // attributes
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        likeType: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'like'
        // options
    });
    return Like;
}