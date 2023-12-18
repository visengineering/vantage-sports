import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  BelongsTo,
  NonAttribute,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  CreationAttributes,
  HasManySetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
} from 'sequelize';
import { Event } from './Event';
import db from '../../config/database';
import { Participant } from '.';

export const TimeslotsTableName = 'timeslots';

export class Timeslot extends Model<
  InferAttributes<Timeslot>,
  InferCreationAttributes<Timeslot>
> {
  declare id: CreationOptional<number>;
  declare eventId: number;
  declare timeslot: Date[];
  declare startDate: Date;
  declare endDate: Date;
  declare duration: number; // in nr of minutes
  declare cost: number;
  declare maxParticipantsCount: number;
  declare participantsCount: CreationOptional<number>;
  declare isNotificationProcessed: CreationOptional<boolean>;
  declare notificationDate: CreationOptional<Date>;
  declare isCancelled: CreationOptional<boolean>;
  declare cancelDate: CreationOptional<Date>;
  declare associate: (models: Model<any>[]) => void;

  // // You can also pre-declare possible inclusions, these will only be populated if you
  // // actively include a relation.
  declare participants?: NonAttribute<Participant[]>; // Note this is optional since it's only populated when explicitly requested in code

  // // Since TS cannot determine model association at compile time
  // // we have to declare them here purely virtually
  // // these will not exist until `Model.init` was called.
  // declare getParticipants: HasManyGetAssociationsMixin<Participant>;
  // declare addParticipant: HasManyAddAssociationMixin<Participant, number>;
  // declare addParticipants: HasManyAddAssociationsMixin<
  //   CreationAttributes<Participant>,
  //   number
  // >;
  // declare setParticipants: HasManySetAssociationsMixin<Participant, number>;
  // declare removeParticipant: HasManyRemoveAssociationMixin<Participant, number>;
  // declare removeParticipants: HasManyRemoveAssociationsMixin<
  //   Participant,
  //   number
  // >;
  // declare hasParticipant: HasManyHasAssociationMixin<Participant, number>;
  // declare hasParticipants: HasManyHasAssociationsMixin<Participant, number>;
  // declare countParticipants: HasManyCountAssociationsMixin;
  // declare createParticipant: HasManyCreateAssociationMixin<
  //   Participant,
  //   'eventId'
  // >;
  public static deleteTimeSlots(eventId: number) {
    return Timeslot.destroy({
      where: {
        eventId,
      },
    });
  }

  public static getTimeslotsWithParticipants(eventId: number) {
    return Timeslot.findAll({
      where: {
        eventId,
      },
      include: [
        {
          model: Participant,
          as: 'participants',
          attributes: ['id'],
        },
      ],
    });
  }

  public readonly event?: Event;
  public static associations: {
    event: BelongsTo<Timeslot, Event>;
  };
}

export const TimeslotTableDefinition = {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: false,
    references: { model: { tableName: 'events' }, key: 'id' },
  },
  timeslot: {
    allowNull: false,
    type: DataTypes.RANGE(DataTypes.DATE),
  },
  startDate: {
    type: DataTypes.DATE(3),
  },
  endDate: {
    type: DataTypes.DATE(3),
  },
  duration: {
    // in nr of minutes
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cost: DataTypes.DECIMAL(10, 2),
  maxParticipantsCount: DataTypes.INTEGER,
  participantsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  isNotificationProcessed: { type: DataTypes.BOOLEAN, defaultValue: false },
  isCancelled: { type: DataTypes.BOOLEAN, defaultValue: false },
  cancelDate: DataTypes.DATE(3),
  notificationDate: DataTypes.DATE(3),
};

Timeslot.init(TimeslotTableDefinition, {
  sequelize: db,
  tableName: TimeslotsTableName,
  modelName: 'Timeslot',
  // don't add the timestamp attributes (updatedAt, createdAt)
  timestamps: false,
});

export default Timeslot;
