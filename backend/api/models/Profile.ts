import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Op,
  NonAttribute,
} from 'sequelize';
import db from '../../config/database';
import { Sport } from './Sport';
import { Position } from './Position';
import { Media } from './Media';
import { Event } from './Event';
import { User, UserTypeEnum } from './User';
import Timeslot from './Timeslot';
import {
  ReferralSourceIdEnum,
  ReferrralSourceTableName,
} from './ReferralSource';
import { GeoAddressTableName } from './GeoAddress';

export { UserTypeEnum };

export const ProfileTableName = 'profiles';

export class Profile extends Model<
  InferAttributes<Profile>,
  InferCreationAttributes<Profile>
> {
  declare id: CreationOptional<number>;
  declare name: CreationOptional<string>; // Name is missing for old profiles before new Sign Up rollout (<May 2022)
  declare sportId: CreationOptional<number>;
  declare universityId: CreationOptional<number>;
  declare city: CreationOptional<string>;
  declare state: CreationOptional<string>;
  declare zip: CreationOptional<string>;
  declare geoAddressId: CreationOptional<number>;
  declare primaryPositionId: CreationOptional<number>;
  declare secondaryPositionId: CreationOptional<number>;
  declare skill1Id: CreationOptional<number>;
  declare skill2Id: CreationOptional<number>;
  declare skill3Id: CreationOptional<number>;
  declare skill4Id: CreationOptional<number>;
  declare skill: CreationOptional<string>;
  declare rating: CreationOptional<number>;
  declare gender: CreationOptional<string>;
  declare class: CreationOptional<string>;
  declare bio: CreationOptional<string>;
  declare height: CreationOptional<string>;
  declare weight: CreationOptional<string>;
  declare hometown: CreationOptional<string>;
  declare cellphone: CreationOptional<string>;
  declare isPhoneVerified: CreationOptional<boolean>;
  declare bannerImage: CreationOptional<number>; // on PROD db is a string, shouldn't be a big problem tho
  declare profileImage: CreationOptional<number>; // on PROD db is a string, shouldn't be a big problem tho
  declare userId: CreationOptional<number>;
  declare userType: CreationOptional<UserTypeEnum>;
  declare verified: CreationOptional<boolean>;
  declare premium: CreationOptional<number>;
  declare hidden: CreationOptional<boolean>;
  declare inflcr: CreationOptional<boolean>;
  declare referralSourceId: CreationOptional<ReferralSourceIdEnum>;
  declare createdAt: CreationOptional<string>;
  declare updatedAt: CreationOptional<string>;
  declare path: CreationOptional<string>;
  declare disabledBooking: CreationOptional<boolean>;

  // optional user attribute when fetching both Models together
  declare user: NonAttribute<User>;

  // Commented out as we have a custom implementation for correct ordering
  // declare getEvents: HasManyGetAssociationsMixin<Event>;
  declare addEvent: HasManyAddAssociationMixin<Event, number>;
  declare addEvents: HasManyAddAssociationsMixin<Event, number>;
  declare setEvents: HasManySetAssociationsMixin<Event, number>;
  declare removeEvent: HasManyRemoveAssociationMixin<Event, number>;
  declare removeEvents: HasManyRemoveAssociationsMixin<Event, number>;
  declare hasEvent: HasManyHasAssociationMixin<Event, number>;
  declare hasEvents: HasManyHasAssociationsMixin<Event, number>;
  declare countEvents: HasManyCountAssociationsMixin;
  declare createEvent: HasManyCreateAssociationMixin<Event, 'profileId'>;

  getProfileImage() {
    return Media.findOne({
      where: { profileId: this.id, type: 'profile' },
      order: [['createdAt', 'DESC']],
    });
  }

  getBannerImage() {
    return Media.findOne({
      where: { profileId: this.id, type: 'banner' },
      order: [['createdAt', 'DESC']],
    });
  }

  getEventsFromDate(startDate: Date) {
    return Event.findAll({
      attributes: ['id'],
      where: {
        profileId: this.id,
      },
      include: [
        {
          model: Timeslot,
          attributes: [],
          as: 'timeslots',
          required: true,
          where: {
            [Op.or]: {
              startDate: {
                [Op.gte]: startDate,
              },
              [Op.and]: {
                startDate: {
                  [Op.lte]: startDate,
                },
                endDate: {
                  [Op.gte]: startDate,
                },
              },
            },
          },
        },
      ],
    });
  }

  getEvents() {
    return Event.findAll({
      where: { profileId: this.id },
      order: [['createdAt', 'DESC']],
    });
  }

  getEventCount() {
    return Event.count({ where: { profileId: this.id } });
  }
}

Profile.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, unique: false },
    sportId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false,
      references: { model: Sport, key: 'id' },
    },
    universityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false,
      references: { model: { tableName: 'universities' }, key: 'id' },
    },
    city: { type: DataTypes.STRING, allowNull: true, unique: false },
    state: { type: DataTypes.STRING, unique: false },
    zip: { type: DataTypes.STRING, unique: false },
    geoAddressId: {
      type: DataTypes.INTEGER,
      unique: true,
      references: { model: { tableName: GeoAddressTableName }, key: 'id' },
    },
    primaryPositionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false,
      references: { model: Position, key: 'id' },
    },
    secondaryPositionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false,
      references: { model: { tableName: 'positions' }, key: 'id' },
    },
    skill1Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false,
      references: { model: { tableName: 'skills' }, key: 'id' },
    },
    skill2Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false,
      references: { model: { tableName: 'skills' }, key: 'id' },
    },
    skill3Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false,
      references: { model: { tableName: 'skills' }, key: 'id' },
    },
    skill4Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false,
      references: { model: { tableName: 'skills' }, key: 'id' },
    },
    skill: { type: DataTypes.STRING, unique: false },
    rating: { type: DataTypes.INTEGER, defaultValue: null },
    gender: { type: DataTypes.STRING, unique: false },
    class: { type: DataTypes.STRING, unique: false },
    bio: { type: DataTypes.STRING, unique: false },
    height: { type: DataTypes.STRING, unique: false },
    weight: { type: DataTypes.STRING, unique: false },
    hometown: { type: DataTypes.STRING, unique: false },
    cellphone: { type: DataTypes.STRING, unique: false },
    isPhoneVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    bannerImage: { type: DataTypes.INTEGER, unique: false }, // on PROD db is a string, shouldn't be a big problem tho
    profileImage: { type: DataTypes.INTEGER, unique: false }, // on PROD db is a string, shouldn't be a big problem tho
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: { tableName: 'users' }, key: 'id' },
    },
    userType: { type: DataTypes.STRING, allowNull: true, unique: false },
    verified: { type: DataTypes.BOOLEAN, allowNull: true, unique: false },
    premium: { type: DataTypes.INTEGER, allowNull: true, unique: false },
    hidden: { type: DataTypes.BOOLEAN, allowNull: true, unique: false },
    inflcr: { type: DataTypes.BOOLEAN, allowNull: true, unique: false },
    referralSourceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false,
      references: { model: { tableName: ReferrralSourceTableName }, key: 'id' },
    },
    createdAt: { type: DataTypes.DATE(3), defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE(3), defaultValue: DataTypes.NOW },
    path: { type: DataTypes.STRING, allowNull: true },
    disabledBooking: { type: DataTypes.BOOLEAN, allowNull: false },
  },

  { sequelize: db, tableName: ProfileTableName, modelName: 'profile' }
);

export default Profile;
