import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '../../config/database';

export const ReferrralSourceTableName = 'referral_sources';
const modelName = ReferrralSourceTableName;

export enum ReferralSourceEnum {
  FACEBOOK = 'Facebook',
  INSTAGRAM = 'Instagram',
  TIKTOK = 'TikTok',
  COACH_FROM_VANTAGE = 'Coach from Vantage',
  FRIEND_USING_VANTAGE = 'Friend using Vantage',
  PEACH_JAR = 'Peachjar',
  GOOGLE = 'Google',
  OTHER = 'Other',
}

export enum ReferralSourceIdEnum {
  FACEBOOK = 1,
  INSTAGRAM = 2,
  TIKTOK = 3,
  COACH_FROM_VANTAGE = 4,
  FRIEND_USING_VANTAGE = 5,
  PEACH_JAR = 6,
  GOOGLE = 7,
  OTHER = 8,
}

export const mapInputToReferralSourceId = (
  input: any
): ReferralSourceIdEnum | null => {
  if (Object.values(ReferralSourceIdEnum).includes(input)) {
    return input;
  } else {
    return null;
  }
};

export class ReferralSource extends Model<
  InferAttributes<ReferralSource>,
  InferCreationAttributes<ReferralSource>
> {
  declare id: ReferralSourceIdEnum;
  declare name: ReferralSourceEnum;
  declare createdAt: CreationOptional<string>;
  declare updatedAt: CreationOptional<string>;
}

ReferralSource.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, unique: true },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize: db,
    tableName: ReferrralSourceTableName,
    modelName: modelName,
  }
);

export default ReferralSource;
