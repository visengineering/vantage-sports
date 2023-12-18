import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '../../config/database';

export const SignupStartedTableName = 'signup_starteds';
const modelName = SignupStartedTableName;

export class SignupStarted extends Model<
  InferAttributes<SignupStarted>,
  InferCreationAttributes<SignupStarted>
> {
  declare email: string;
  declare numberOfTries: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

SignupStarted.init(
  {
    email: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    numberOfTries: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      defaultValue: 1,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: db,
    tableName: SignupStartedTableName,
    modelName: modelName,
  }
);

export default SignupStarted;
