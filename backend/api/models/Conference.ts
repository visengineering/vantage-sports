import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '../../config/database';

const tableName = 'conferences';

export class Conference extends Model<
  InferAttributes<Conference>,
  InferCreationAttributes<Conference>
> {
  declare id: CreationOptional<number>;
  declare name: CreationOptional<string>;
}

Conference.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
  },
  {
    sequelize: db,
    tableName: tableName,
    modelName: 'Conference',
  }
);

export default Conference;
