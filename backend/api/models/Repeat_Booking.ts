import Sequelize, { DataTypes } from 'sequelize';
import db from '../../config/database';
import { Profile } from './Profile';

export class Repeat_Booking extends Sequelize.Model {}
Repeat_Booking.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coachProfileId: {
      type: DataTypes.INTEGER,
      unique: false,
      references: { model: Profile, key: 'id' },
    },
    playerProfileId: {
      type: DataTypes.INTEGER,
      unique: false,
      references: { model: Profile, key: 'id' },
    },
    participationCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
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
    tableName: 'repeat_bookings',
    modelName: 'repeat_bookings',
  }
);

export default Repeat_Booking;
