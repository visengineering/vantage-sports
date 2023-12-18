import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  BelongsTo,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  NonAttribute,
  Association,
  CreationAttributes,
} from 'sequelize';
import db from '../../config/database';
import { Op } from 'sequelize';
import { merge } from 'lodash';
import logger from '../helpers/logger';

import {
  GeoAddress,
  GeoAddressTableName,
  GeoAddressDBType,
} from './GeoAddress';
import { Profile as ProfileModel } from './Profile';
import { Position } from './Position';
import { Sport } from './Sport';
import { University } from './University';
import { Skill } from './Skill';
import { Media } from './Media';
import Timeslot from './Timeslot';
import { Participant } from './Participant';
import { FormInputTimeSlotModified } from 'api/types';
import Review from './Review';

export const EventsTableName = 'events';
export const EventTypeColumnName = 'eventType';

export enum EventTypeEnum {
  // 1 - legacy one time event
  LEGACY_ONE_TIME = 'LEGACY_ONE_TIME',
  // 2 - event on multiple dates and timeslots
  MULTIPLE_TIMESLOTS = 'MULTIPLE_TIMESLOTS',
  // 3 - event meant to be an availability range with multiple dates and timeslots
  AVAILABILITY = 'AVAILABILITY',
}
export type EventType = EventTypeEnum | null;

export const EventTypeColumn = {
  type: DataTypes.ENUM,
  values: [EventTypeEnum.LEGACY_ONE_TIME, EventTypeEnum.MULTIPLE_TIMESLOTS],
  defaultValue: null,
};

export type EventSessionType = 'Virtual' | 'In-Person';

export enum EventSessionTypeEnum {
  Virtual = 'Virtual',
  In_Person = 'In-Person',
}

type createEventGeoAddressParamsType = {
  geoAddressDB: GeoAddressDBType | undefined;
  location: string;
};

type setEventGeoAddressParamsType = createEventGeoAddressParamsType;

export class Event extends Model<
  InferAttributes<Event>,
  InferCreationAttributes<Event>
> {
  declare id: CreationOptional<number>;
  declare profileId: number;
  declare universityId: CreationOptional<number>;
  declare sportId: CreationOptional<number>;
  declare skillId: CreationOptional<number>;
  declare mediaId: CreationOptional<number>;
  declare max: number;
  declare participantsCount: CreationOptional<number>;
  declare duration: number;
  declare sessionType: EventSessionType;
  declare cost: number;
  declare date: Date;
  declare timezone: string;
  declare location: CreationOptional<string>;
  declare geoAddressId: CreationOptional<number>;
  declare title: string;
  declare description: CreationOptional<string>;
  declare isNotificationProcessed: CreationOptional<boolean>;
  declare isEventCancelled: CreationOptional<boolean>;
  declare eventCancelDate: CreationOptional<Date>;
  declare notificationDate: CreationOptional<Date>;
  declare dailyReminderAt: CreationOptional<Date>;
  declare eventType: EventType;
  declare createdAt: CreationOptional<string>;
  declare updatedAt: CreationOptional<string>;

  declare associate: (models: Model<any>[]) => void;

  public readonly geoAddress?: GeoAddress;
  public readonly coach?: ProfileModel;
  public readonly sport?: Sport;
  public readonly university?: University;
  public readonly position?: Position;
  public readonly media?: Media;
  public readonly skill?: Skill;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare timeslots?: NonAttribute<Timeslot[]>; // Note this is optional since it's only populated when explicitly requested in code

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getTimeslots: HasManyGetAssociationsMixin<Timeslot>;
  declare addTimeslot: HasManyAddAssociationMixin<Timeslot, number>;
  declare addTimeslots: HasManyAddAssociationsMixin<
    CreationAttributes<Timeslot>,
    number
  >;
  declare setTimeslots: HasManySetAssociationsMixin<Timeslot, number>;
  declare removeTimeslot: HasManyRemoveAssociationMixin<Timeslot, number>;
  declare removeTimeslots: HasManyRemoveAssociationsMixin<Timeslot, number>;
  declare hasTimeslot: HasManyHasAssociationMixin<Timeslot, number>;
  declare hasTimeslots: HasManyHasAssociationsMixin<Timeslot, number>;
  declare countTimeslots: HasManyCountAssociationsMixin;
  declare createTimeslot: HasManyCreateAssociationMixin<Timeslot, 'eventId'>;

  declare reviews?: NonAttribute<Timeslot[]>;

  declare setReviews: HasManySetAssociationsMixin<Review, number>;
  declare removeReview: HasManyRemoveAssociationMixin<Review, number>;
  declare removeReviews: HasManyRemoveAssociationsMixin<Review, number>;
  declare hasReview: HasManyHasAssociationMixin<Review, number>;
  declare hasReviews: HasManyHasAssociationsMixin<Review, number>;
  declare countReviews: HasManyCountAssociationsMixin;
  declare createReview: HasManyCreateAssociationMixin<Review, 'eventId'>;

  public static associations: {
    geoAddress: BelongsTo<Event, GeoAddress>;
    coach: BelongsTo<Event, ProfileModel>;
    sport: BelongsTo<Event, Sport>;
    university: BelongsTo<Event, University>;
    position: BelongsTo<Event, Position>;
    media: BelongsTo<Event, Media>;
    skill: BelongsTo<Event, Skill>;
    timeslots: Association<Event, Timeslot>;
    reviews: Association<Event, Review>;
  };

  declare getParticipants: HasManyGetAssociationsMixin<Participant>;
  declare addParticipant: HasManyAddAssociationMixin<Participant, number>;
  declare addParticipants: HasManyAddAssociationsMixin<Participant, number>;
  declare setParticipants: HasManySetAssociationsMixin<Participant, number>;
  declare removeParticipant: HasManyRemoveAssociationMixin<Participant, number>;
  declare removeParticipants: HasManyRemoveAssociationsMixin<
    Participant,
    number
  >;
  declare hasParticipant: HasManyHasAssociationMixin<Participant, number>;
  declare hasParticipants: HasManyHasAssociationsMixin<Participant, number>;
  declare countParticipants: HasManyCountAssociationsMixin;
  declare createParticipant: HasManyCreateAssociationMixin<
    Participant,
    'eventId'
  >;

  getEventCount = () => {
    return Event.count({ where: { profileId: this.id } });
  };

  getEventGeoAddress = async () => {
    const { id, sessionType, location, geoAddressId } = this as Event;

    logger.info('Get GeoAddress for Event: ', {
      id,
      sessionType,
      location,
      geoAddressId,
    });

    try {
      const geoAddress = await GeoAddress.findByPk(geoAddressId);

      logger.info('Event GeoAddress: ', JSON.stringify(geoAddress, null, 4));
      return geoAddress;
    } catch (error: any) {
      logger.error('Failed to get GeoAddress for Event.\nError: ', error);
      return null;
    }
  };

  createEventGeoAddress = async (params: createEventGeoAddressParamsType) => {
    const event = this as Event;
    const { geoAddressDB, location } = params;

    logger.info(`Create GeoAddress for Event with Id ${event.id}.`);
    logger.info('Event: ', JSON.stringify(event, null, 4));
    logger.info('Params: ', JSON.stringify(params, null, 4));

    if (!geoAddressDB || !location) {
      logger.error('GeoAddress entry for Event can not proceed:');

      if (!geoAddressDB) logger.error('(#000041): geoAddressDB data missing.');
      if (!location) logger.error('(#000041): location data missing.');

      return undefined;
    }

    try {
      const geoAddress = await GeoAddress.create(geoAddressDB);

      logger.info(
        'GeoAddress create attempt result for Event: ',
        JSON.stringify(geoAddress, null, 4)
      );

      if (!geoAddress?.id) {
        logger.error('GeoAddress create attempt for Event is failed!');
        return undefined;
      }

      try {
        await event.update({
          sessionType: EventSessionTypeEnum.In_Person,
          location,
          geoAddressId: geoAddress.id,
        });

        logger.info('GeoAddress entry for Event is successfull.');
        logger.info('Updated Event: ', JSON.stringify(event, null, 4));

        return geoAddress;
      } catch (error) {
        logger.error(
          'Failed to update Event for new GeoAddress.\nError: ',
          error
        );

        await geoAddress.destroy();
        logger.info('GeoAddress entry removed for Event update failure.');

        return undefined;
      }
    } catch (error: any) {
      logger.error('Failed to create GeoAddress for Event.\nError: ', error);
      return undefined;
    }
  };

  setEventGeoAddress = async (params: setEventGeoAddressParamsType) => {
    const event = this as Event;
    const { geoAddressDB, location } = params;

    logger.info(`Update GeoAddress for Event with Id ${event.id}.`);
    logger.info('Event: ', JSON.stringify(event, null, 4));
    logger.info('Params: ', JSON.stringify(params, null, 4));

    if (!geoAddressDB || !location) {
      logger.error('GeoAddress update for Event can not proceed:');

      if (!geoAddressDB) logger.error('(#000041): geoAddressDB data missing.');
      if (!location) logger.error('(#000041): location data missing.');

      return undefined;
    }

    try {
      const geoAddress = await GeoAddress.findByPk(event.geoAddressId);

      logger.info('Event GeoAddress: ', JSON.stringify(geoAddress, null, 4));

      if (!geoAddress?.id) {
        logger.error('GeoAddress not found, attemp to create new one.');
        return await event.createEventGeoAddress({ geoAddressDB, location });
      }

      const unifiedGeoAddress = merge(geoAddress, {
        streetNumber: geoAddressDB.streetNumber || null,
        route: geoAddressDB.route || null,
        area: geoAddressDB.area || null,
        city: geoAddressDB.city || null,
        region: geoAddressDB.region || null,
        state: geoAddressDB.state || null,
        postalCode: geoAddressDB.postalCode || null,
        country: geoAddressDB.country || null,
        formattedAddress: geoAddressDB.formattedAddress || null,
        placeId: geoAddressDB.placeId || null,
        name: geoAddressDB.name || null,
        geometryLocationLat: geoAddressDB.geometryLocationLat ?? null,
        geometryLocationLng: geoAddressDB.geometryLocationLng ?? null,
      });
      geoAddress.update(unifiedGeoAddress);
      await geoAddress.save();

      logger.info('Updated GeoAddress: ', JSON.stringify(geoAddress, null, 4));

      try {
        await event.update({
          sessionType: EventSessionTypeEnum.In_Person,
          location,
        });

        logger.info('Updated Event: ', JSON.stringify(event, null, 4));
      } catch (error) {
        logger.error(
          'Event update secure attempt for GeoAddress update is failed.\nError: ',
          error
        );
      }

      return geoAddress;
    } catch (error: any) {
      logger.error('Something went wrong, attemp to create new one.');
      return await event.createEventGeoAddress({ geoAddressDB, location });
    }
  };

  removeEventGeoAddress = async () => {
    const event = this as Event;
    const geoAddressId = event.geoAddressId;

    logger.info(`Remove GeoAddress for Event with Id ${event.id}.`);
    logger.info('Event: ', JSON.stringify(event, null, 4));

    if (!geoAddressId) {
      logger.info('No GeoAddress exist for this Event.');
      return true;
    }

    try {
      const unifiedEvent = merge(event, { geoAddressId: null });
      event.update(unifiedEvent);
      await event.save();

      logger.info(
        'Updated Event after removed geoAddressId: ',
        JSON.stringify(event, null, 4)
      );

      const geoAddress = await GeoAddress.findByPk(geoAddressId);
      logger.info('Event GeoAddress: ', JSON.stringify(geoAddress, null, 4));

      if (!geoAddress?.id) {
        logger.error('GeoAddress entry not found for Event.');
        return true;
      }

      await geoAddress.destroy();
      logger.info('GeoAddress entry removed for Event.');

      return true;
    } catch (error: any) {
      logger.error('Failed to remove GeoAddress for Event.\nError: ', error);
      return false;
    }
  };

  public static getOverlappingTimeSlots = (
    eventIds: Event[],
    timeSlots: FormInputTimeSlotModified[],
    timeslotId?: number
  ) => {
    const orEquation = [
      ...timeSlots.map((timeSlot: FormInputTimeSlotModified) => {
        return {
          startDate: {
            [Op.lt]: timeSlot.endDate,
          },
          endDate: {
            [Op.gt]: timeSlot.startDate,
          },
        };
      }),
    ];

    return Event.findAll({
      where: {
        id: [...eventIds.map((event) => event.id)],
        isEventCancelled: false,
      },
      include: [
        {
          model: Timeslot,
          as: 'timeslots',
          required: true,
          where: {
            ...(timeslotId
              ? {
                  id: {
                    [Op.ne]: timeslotId,
                  },
                }
              : {}),
            [Op.or]: orEquation,
            isCancelled: false,
          },
        },
      ],
    });
  };
  public static getPastEventsQuery = () => {
    return {
      include: [
        {
          model: Timeslot,
          as: 'timeslots',
          required: true,
          where: {
            endDate: {
              [Op.lt]: new Date().toJSON(),
            },
          },
          attributes: ['startDate', 'endDate'],
        },
      ],
    };
  };
}

Event.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    profileId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: { tableName: 'profiles' }, key: 'id' },
    },
    universityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: { tableName: 'universities' }, key: 'id' },
    },
    sportId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: { tableName: 'sports' }, key: 'id' },
    },
    skillId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: { tableName: 'skills' }, key: 'id' },
    },
    mediaId: { type: DataTypes.INTEGER, allowNull: true },
    max: DataTypes.INTEGER,
    participantsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    duration: DataTypes.DECIMAL(10, 2),
    sessionType: DataTypes.STRING,
    cost: DataTypes.DECIMAL(10, 2),
    date: DataTypes.DATE(3),
    timezone: {
      type: DataTypes.STRING,
      defaultValue: 'America/New_York',
      allowNull: false,
    },
    location: DataTypes.STRING,
    geoAddressId: {
      type: DataTypes.INTEGER,
      unique: true,
      references: { model: { tableName: GeoAddressTableName }, key: 'id' },
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    isNotificationProcessed: { type: DataTypes.BOOLEAN, defaultValue: false },
    isEventCancelled: { type: DataTypes.BOOLEAN, defaultValue: false },
    eventCancelDate: DataTypes.DATE(3),
    notificationDate: DataTypes.DATE(3),
    dailyReminderAt: { type: DataTypes.DATE(3), defaultValue: null },
    [EventTypeColumnName]: EventTypeColumn,
    createdAt: { type: DataTypes.DATE(3), defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE(3), defaultValue: DataTypes.NOW },
  },

  { sequelize: db, tableName: EventsTableName, modelName: 'Event' }
);

export default Event;
