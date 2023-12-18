import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '../../config/database';

const tableName = 'positions';
export class Position extends Model<
  InferAttributes<Position>,
  InferCreationAttributes<Position>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare sportId: number;
}

Position.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING },
    sportId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false,
      references: { model: { tableName: 'sports' }, key: 'id' },
    },
  },
  {
    tableName: tableName,
    modelName: 'position',
    sequelize: db,
  }
);

export default Position;
