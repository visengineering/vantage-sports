import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasOneCreateAssociationMixin,
} from 'sequelize';
import db from '../../config/database';
import bcryptSevice from '../services/bcrypt.service';
import { Profile } from './Profile';

const tableName = 'users';

export enum UserTypeEnum {
  // 1 - coach / trainer
  COACH = '1',
  // 2 - attendee / trainee
  TRAINEE = '2',
}

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>;
  declare password: string;
  declare email: string;
  // TODO: Remove guest column from the database
  declare admin: CreationOptional<boolean>;
  declare token: CreationOptional<string>;
  declare source: CreationOptional<string>;
  declare termsOfService: CreationOptional<boolean>;
  declare privacyPolicy: CreationOptional<boolean>;
  declare userType: CreationOptional<UserTypeEnum>;
  declare sSocialId: CreationOptional<string>;
  declare sSocialToken: CreationOptional<string>;
  declare sSocialType: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getProfile: HasOneGetAssociationMixin<Profile>;
  declare addProfile: HasOneSetAssociationMixin<Profile, number>;
  declare createProfile: HasOneCreateAssociationMixin<Profile>;
}

User.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    password: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    // TODO: Remove guest column from the database
    admin: { type: DataTypes.BOOLEAN, allowNull: true },
    token: { type: DataTypes.STRING, allowNull: true },
    source: { type: DataTypes.STRING, allowNull: true },
    termsOfService: { type: DataTypes.BOOLEAN, allowNull: true },
    privacyPolicy: { type: DataTypes.BOOLEAN, allowNull: true },
    userType: { type: DataTypes.STRING, allowNull: true },
    sSocialId: { type: DataTypes.STRING, allowNull: true },
    sSocialToken: { type: DataTypes.TEXT, allowNull: true },
    sSocialType: { type: DataTypes.STRING, allowNull: true },
    createdAt: {
      type: DataTypes.DATE(3),
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE(3),
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: db,
    tableName: tableName,
    modelName: 'user',
  }
);

User.addHook('beforeCreate', (user: User) => {
  user.password = bcryptSevice().password(user); // eslint-disable-line no-param-reassign
});

User.addHook('beforeUpdate', (user: User) => {
  if (user.changed('password')) {
    user.password = bcryptSevice().password(user); // eslint-disable-line no-param-reassign
  }
});

// eslint-disable-next-line
User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get()) as any;
  delete values.password;
  return values;
};

export default User;
