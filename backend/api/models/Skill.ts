import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '../../config/database';
import { Sport } from './Sport';

export class Skill extends Model<
  InferAttributes<Skill>,
  InferCreationAttributes<Skill>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare sportId: number;
}

Skill.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
    sportId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false,
      references: {
        model: Sport,
        key: 'id',
      },
    },
  },
  {
    sequelize: db,
    tableName: 'skills',
    modelName: 'skill',
  }
);

export default Skill;
