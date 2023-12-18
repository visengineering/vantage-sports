import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '../../config/database';

const tableName = 'resets';
import { User } from './User';

export class Reset extends Model<
  InferAttributes<Reset>,
  InferCreationAttributes<Reset>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare email: string;
  declare key: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
Reset.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: { tableName: 'users' }, key: 'id' },
    },
    email: DataTypes.STRING,
    key: DataTypes.STRING,
    createdAt: { type: DataTypes.DATE(3), defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE(3), defaultValue: DataTypes.NOW },
  },
  {
    sequelize: db,
    tableName: tableName,
    modelName: 'Reset',
  }
);

Reset.belongsTo(User, { as: 'user' });
export default Reset;
