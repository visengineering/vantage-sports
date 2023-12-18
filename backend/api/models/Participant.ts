import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  BelongsTo,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasOneCreateAssociationMixin,
  NonAttribute,
} from 'sequelize';
import EventModel from './Event';
import db from '../../config/database';
import { Review } from './Review';
import Timeslot, { TimeslotsTableName } from './Timeslot';
import Profile from './Profile';
import User from './Profile';

export const ParticipantsTableName = 'participants';
export const ParticipantsTimeslotIdColumnName = 'timeslotId';

export const TimeslotIdColumn = {
  type: DataTypes.INTEGER,
  allowNull: true,
  unique: false,
  references: { model: { tableName: TimeslotsTableName }, key: 'id' },
  defaultValue: null,
};

export class Participant extends Model<
  InferAttributes<Participant>,
  InferCreationAttributes<Participant>
> {
  declare id: CreationOptional<number>;
  declare eventId: number;
  declare clientId: User['id']; // Watch out! This is user id, not profile id.
  declare coachId: Profile['id']; // Watch out! This is PROFILE id, not user id.
  declare paymentReference: CreationOptional<string>;
  declare paymentIntent: CreationOptional<string>;
  declare customer: CreationOptional<string>;
  declare reviewId: CreationOptional<number>;
  declare toast_notification_sent: CreationOptional<boolean>;
  declare email_notification_sent: CreationOptional<boolean>;
  declare paid: CreationOptional<boolean>;
  declare waiver: CreationOptional<boolean>;
  declare timezone: CreationOptional<string>;
  declare timeslotId: number;
  declare createdAt: CreationOptional<string>;
  declare updatedAt: CreationOptional<string>;

  declare client: NonAttribute<User>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getTimeslot: HasOneGetAssociationMixin<Timeslot>;
  declare addTimeslot: HasOneSetAssociationMixin<Timeslot, number>;
  declare createTimeslot: HasOneCreateAssociationMixin<Timeslot>;

  public readonly events?: EventModel;
  public readonly review?: Review;
  public static associations: {
    events: BelongsTo<Participant, EventModel>;
    review: BelongsTo<Participant, Review>;
  };

  public static hasParticipantPaid(paymentIntent?: string) {
    return paymentIntent
      ? Participant.count({ where: { paymentIntent, paid: true } }).then(
          (count) => {
            if (count !== 0) {
              return true;
            }
            return false;
          }
        )
      : false;
  }
  getEvent() {
    return EventModel.findOne({
      where: { id: this.eventId },
      order: [['createdAt', 'DESC']],
    });
  }
}

Participant.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      references: { model: { tableName: 'users' }, key: 'id' },
    },
    coachId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      references: { model: { tableName: 'profiles' }, key: 'id' },
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      references: { model: { tableName: 'events' }, key: 'id' },
    },
    paymentReference: { type: DataTypes.STRING, unique: false },
    paymentIntent: { type: DataTypes.STRING, unique: true, defaultValue: null },
    customer: { type: DataTypes.STRING, defaultValue: null },
    reviewId: {
      type: DataTypes.INTEGER,
      unique: true,
      references: { model: { tableName: 'reviews' }, key: 'id' },
    },
    toast_notification_sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'toast_notification_sent',
    },
    email_notification_sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'email_notification_sent',
    },
    paid: { type: DataTypes.BOOLEAN, unique: false },
    waiver: { type: DataTypes.BOOLEAN, unique: false },
    timezone: {
      type: DataTypes.STRING,
      defaultValue: 'America/New_York',
      allowNull: false,
    },
    timeslotId: TimeslotIdColumn,
    createdAt: { type: DataTypes.DATE(3), defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE(3), defaultValue: DataTypes.NOW },
  },
  {
    sequelize: db,
    tableName: ParticipantsTableName,
    modelName: 'Participant',
  }
);

export default Participant;
