'use strict';
import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '../../config/database';

export class University extends Model<
  InferAttributes<University>,
  InferCreationAttributes<University>
> {
  declare name: CreationOptional<string>;
  declare city: CreationOptional<string>;
  declare state: CreationOptional<string>;
  declare conferenceId: CreationOptional<number>;
  declare divisionId: CreationOptional<number>;
}

University.init(
  {
    name: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    conferenceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false,
      references: {
        model: { tableName: 'conferences' },
        key: 'id',
      },
    },
    divisionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false,
      references: {
        model: { tableName: 'divisions' },
        key: 'id',
      },
    },
  },
  {
    sequelize: db,
    tableName: 'universities',
    modelName: 'university',
  }
);

export default University;
