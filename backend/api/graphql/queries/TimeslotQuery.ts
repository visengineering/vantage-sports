import { Op } from 'sequelize';
import {
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLUnionType,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { Event, Participant, Review, Timeslot } from '../../models';
import { TimeslotConnectionType, TimeslotType } from '../types/TimeslotType';
import { Profile } from '../../models';

const timeslotFilterParams = [
  'maxParticipantsCount',
  'startDate',
  'endDate',
  'participantsCount',
  'isCancelled',
  'notificationDate',
  'cancelDate',
];

export const timeslotQuery = {
  type: new GraphQLUnionType({
    name: 'TimeslotUnion',
    types: [TimeslotType, TimeslotConnectionType],
    resolveType(value: unknown) {
      return value instanceof Timeslot ? TimeslotType : TimeslotConnectionType;
    },
  }),
  args: {
    id: { name: 'id', type: GraphQLInt },
    coachProfileId: { name: 'coachProfileId', type: GraphQLInt },
    playerUserId: { name: 'playerUserId', type: GraphQLInt },
    maxParticipantsCount: { name: 'maxParticipantsCount', type: GraphQLInt },
    startDate: { name: 'startDate', type: GraphQLDateTime },
    endDate: { name: 'endDate', type: GraphQLDateTime },
    participantsCount: { type: GraphQLInt },
    isCancelled: { type: GraphQLBoolean },
    isNotificationProcessed: { type: GraphQLBoolean },
    notificationDate: { type: GraphQLDateTime },
    cancelDate: { type: GraphQLDateTime },
    createdAt: { name: 'createdAt', type: GraphQLString },
    updatedAt: { name: 'updatedAt', type: GraphQLString },
    completed: { name: 'completed', type: GraphQLBoolean },
    upcoming: { name: 'upcoming', type: GraphQLBoolean },
    limit: { name: 'limit', type: GraphQLInt },
    offset: { name: 'offset', type: GraphQLInt },
  },

  resolve: async (timeslot: any, timeslotQueryArgs: any) => {
    if (timeslotQueryArgs.id) {
      const timeslot = await Timeslot.findByPk(timeslotQueryArgs.id);
      return timeslot;
    }

    const {
      playerUserId = null, // Watch out! This is user id, not profile id.
      coachProfileId = null,
      upcoming = false,
      completed = false,
      limit = 20,
      offset = 0,
    } = timeslotQueryArgs;

    const filtersSet = timeslotFilterParams
      .filter(
        (p) =>
          p in timeslotQueryArgs &&
          (timeslotQueryArgs[p] || timeslotQueryArgs[p] === false)
      )
      .map((filterParam) => ({
        [filterParam]: timeslotQueryArgs[filterParam],
      }))
      .reduce((acc, filter) => ({ ...acc, ...filter }), {});

    const timeslots = await Timeslot.findAndCountAll({
      ...(limit ? { limit } : {}),
      ...(offset || offset === 0 ? { offset } : {}),
      where: {
        ...filtersSet,
        ...(completed
          ? {
              startDate: {
                [Op.lt]: new Date(),
              },
            }
          : {}),
        ...(upcoming
          ? {
              startDate: {
                [Op.gt]: new Date(),
              },
            }
          : {}),
      },
      distinct: true,
      order: upcoming
        ? [['startDate', 'ASC']]
        : completed
        ? [['startDate', 'DESC']]
        : [],
      attributes: [
        'id',
        'startDate',
        'endDate',
        'duration',
        'cost',
        'eventId',
        'maxParticipantsCount',
        'participantsCount',
        'cancelDate',
        'isCancelled',
      ],
      include: [
        {
          model: Event,
          as: 'event',
          include: [{ model: Profile, as: 'coach' }],
        },
        ...(playerUserId || coachProfileId
          ? [
              {
                model: Participant,
                as: 'participants',
                required: true,
                where: {
                  ...(playerUserId
                    ? {
                        clientId: playerUserId, // Watch out! This is user id, not profile id.
                      }
                    : {}),
                  ...(coachProfileId ? { coachId: coachProfileId } : {}),
                  paid: true,
                },
                attributes: [
                  'id',
                  'eventId',
                  'clientId',
                  'coachId',
                  'paymentReference',
                  'paymentIntent',
                  'customer',
                  'paid',
                  'timezone',
                ],
                ...(completed
                  ? {
                      include: [
                        {
                          model: Review,
                          as: 'review',
                          required: false,
                        },
                      ],
                    }
                  : {}),
              },
            ]
          : []),
      ],
    });

    return {
      total: Array.isArray(timeslots.count)
        ? timeslots.count.length
        : timeslots.count,
      edges: timeslots.rows.map((x) => ({ node: x })),
    };
  },
};
