import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '../../config/database';

const tableName = 'divisions';

export class Division extends Model<
  InferAttributes<Division>,
  InferCreationAttributes<Division>
> {
  declare id: CreationOptional<number>;
  declare name: CreationOptional<string>;
}

Division.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
  },
  {
    sequelize: db,
    tableName: tableName,
    modelName: 'Division',
  }
);

export default Division;
