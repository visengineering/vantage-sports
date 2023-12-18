import {
  Op,
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '../../config/database';
import { Participant } from './Participant';

export enum NotificationType {
  EV_UPCOMING_REMINDER = 'EV_UPCOMING_REMINDER',
  EV_DAILY_REMINDER = 'EV_DAILY_REMINDER',
  EV_CREATE = 'EV_CREATE',
  EV_BOOKED = 'EV_BOOKED',
  EV_CANCELLED = 'EV_CANCELLED',
  TS_CANCELLED = 'TS_CANCELLED',
  EV_REVIEW = 'EV_REVIEW',
  WELCOME_USER = 'WELCOME_USER',
  EV_UPDATED_LOCATION = 'EV_UPDATED_LOCATION',
}
export enum NotificationMedium {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
}
export enum NotificationDeliveryStatus {
  // I - Initiated
  I = 'I',
  // S- Sent
  S = 'S',
  // F- Failed
  F = 'F',
}

export class Notification extends Model<
  InferAttributes<Notification>,
  InferCreationAttributes<Notification>
> {
  declare id: CreationOptional<number>;
  declare type: NotificationType;
  declare subject: string;
  declare userId: number;
  declare toNumber: CreationOptional<string>;
  declare toEmail: CreationOptional<string>;
  declare notification_medium: NotificationMedium;
  declare eventIds: number[];
  declare userType: string;
  declare serviceId: CreationOptional<string>;
  declare message: string;
  declare deliveryStatus: NotificationDeliveryStatus;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Notification.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    type: {
      type: DataTypes.ENUM,
      values: [
        'EV_UPCOMING_REMINDER',
        'EV_DAILY_REMINDER',
        'EV_CREATE',
        'EV_BOOKED',
        'EV_CANCELLED',
        'EV_REVIEW',
        'TS_CANCELLED',
        'EV_UPDATED_LOCATION',
      ],
      defaultValue: null,
    },
    subject: { type: DataTypes.STRING },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false,
      references: { model: { tableName: 'users' }, key: 'id' },
    }, //toUserId from the users table
    toNumber: { type: DataTypes.STRING },
    toEmail: { type: DataTypes.STRING },
    notification_medium: {
      type: DataTypes.ENUM,
      values: ['SMS', 'EMAIL'],
      defaultValue: null,
      field: 'notification_medium',
    },
    eventIds: DataTypes.ARRAY(
      // TODO: Check typings here, possibly incorrect usage. Supressed with any.
      // More: https://sequelize.org/v6/class/src/data-types.js~ARRAY.html
      {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        references: { model: { tableName: 'events' }, key: 'id' },
      } as any
    ),
    userType: { type: DataTypes.STRING, allowNull: false },
    serviceId: { type: DataTypes.STRING }, //This will store the reference id  when we send the sms/email
    message: { type: DataTypes.TEXT, allowNull: true },
    deliveryStatus: {
      type: DataTypes.ENUM,
      values: ['I', 'S', 'F'], //I - Initiated,S- Sent, F- Failed
      defaultValue: 'I',
    },
    createdAt: { type: DataTypes.DATE(3), defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE(3), defaultValue: null },
  },
  { sequelize: db, tableName: 'notifications', modelName: 'notification' }
);

/// Function to update email_notification_sent in participants table, once coach review email has been sent
async function updateReviewNotificationStatus(notification: Notification) {
  const { eventIds, type, userId: clientUserId, userType } = notification;
  if (type != NotificationType.EV_REVIEW && Number(userType) != 2) {
    return;
  }

  await Participant.update(
    {
      email_notification_sent: true,
    },
    {
      where: {
        eventId: eventIds[0],
        clientId: clientUserId,
        paid: true,
        paymentReference: { [Op.ne]: null },
        email_notification_sent: false,
      },
    }
  );
}

Notification.addHook('afterUpdate', updateReviewNotificationStatus);

export default Notification;
