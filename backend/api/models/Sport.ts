import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '../../config/database';

const tableName = 'sports';

export class Sport extends Model<
  InferAttributes<Sport>,
  InferCreationAttributes<Sport>
> {
  declare id: CreationOptional<number>;
  declare name: CreationOptional<string>;
  declare createdAt: CreationOptional<string>;
  declare updatedAt: CreationOptional<string>;
}

Sport.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, unique: true },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize: db,
    tableName: tableName,
    modelName: 'sport',
  }
);

export default Sport;
