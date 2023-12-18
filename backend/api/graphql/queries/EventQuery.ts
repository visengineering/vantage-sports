import { Op, QueryTypes } from 'sequelize';
import db from '../../../config/database';
import {
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLUnionType,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

import { EventType, EventConnectionType } from '../types';
import {
  Event,
  Participant,
  Timeslot,
  Profile,
  FavoriteCoach,
  User,
} from '../../models';
import {
  flatMapAnArray,
  addHoursToDate,
  convertMsToHours,
} from '../../helpers/common';

//43200000 = 12 Hours
const DEFAULT_AVAILABLE_TIME_IN_MS = '43200000';

const eventFilterParams = [
  'universityId',
  'sportId',
  'skillId',
  'profileId',
  'mediaId',
  'positionId',
  'sessionType',
  'count',
  'location',
  'title',
  'description',
  'isNotificationProcessed', // TODO: move to timeslots
  'notificationDate', // TODO: move to timeslots
  'eventCancelDate', // TODO: move to timeslots
  'isEventCancelled', // TODO: move to timeslots
  // 'max', // Not anymore, now in timeslots
  // 'date', // Not anymore, now in timeslots
  // 'participantsCount', // Not anymore, now in timeslots
];

const timeslotFilterParams = [
  'maxParticipantsCount',
  'date',
  'participantsCount',
  'isCancelled',
  'notificationDate',
  'startDate',
  'endDate',
  'cancelDate',
];

const completedEventAttributes = [
  'id',
  'profileId',
  'universityId',
  'sportId',
  'skillId',
  'mediaId',
  'positionId',
  'max',
  'duration',
  'sessionType',
  'timezone',
  'location',
  'title',
  'description',
  'isEventCancelled',
  'isNotificationProcessed',
  'notificationDate',
  'dailyReminderAt',
  'eventCancelDate',
  'createdAt',
  'updatedAt',
];

const eventQuery = {
  type: new GraphQLUnionType({
    name: 'EventUnion',
    types: [EventType, EventConnectionType],
    resolveType(value: unknown) {
      return value instanceof Event ? EventType : EventConnectionType;
    },
  }),
  args: {
    id: { name: 'id', type: GraphQLInt },
    geoAddressId: { name: 'geoAddressId', type: GraphQLInt },
    coachProfileId: { name: 'coachProfileId', type: GraphQLInt },
    playerProfileId: { name: 'playerProfileId', type: GraphQLInt },
    universityId: { name: 'universityId', type: GraphQLInt },
    eventType: { name: 'eventType', type: GraphQLString },
    sportId: { name: 'sportId', type: GraphQLInt },
    skillId: { name: 'skillId', type: GraphQLInt },
    mediaId: { name: 'mediaId', type: GraphQLInt },
    positionId: { name: 'positionId', type: GraphQLInt },
    max: { name: 'max', type: GraphQLInt },
    sessionType: { name: 'sessionType', type: GraphQLString },
    date: { name: 'date', type: GraphQLDateTime },
    location: { name: 'location', type: GraphQLString },
    selectedState: { name: 'selectedState', type: GraphQLString },
    title: { name: 'title', type: GraphQLString },
    participantsCount: { type: GraphQLInt },
    description: { name: 'duration', type: GraphQLString },
    isEventCancelled: { type: GraphQLBoolean },
    isNotificationProcessed: { type: GraphQLBoolean },
    notificationDate: { type: GraphQLDateTime },
    eventCancelDate: { type: GraphQLDateTime },
    onlyFavorites: { type: GraphQLBoolean },
    createdAt: { name: 'createdAt', type: GraphQLString },
    updatedAt: { name: 'updatedAt', type: GraphQLString },
    completed: { name: 'completed', type: GraphQLBoolean },
    upcoming: { name: 'upcoming', type: GraphQLBoolean },
    booked: { name: 'booked', type: GraphQLBoolean },
    limit: { name: 'limit', type: GraphQLInt },
    offset: { name: 'offset', type: GraphQLInt },
    withCancelled: { type: GraphQLBoolean },
    includeDisabledBookings: {
      name: 'includeDisabledBookings',
      type: GraphQLBoolean,
    },
  },

  resolve: async (event: any, eventQueryArgs: any) => {
    if (eventQueryArgs.id) {
      const eventWithTimeslots = await Event.findByPk(eventQueryArgs.id, {
        order: [[{ model: Timeslot, as: 'timeslots' }, 'startDate', 'ASC']],
        include: [
          {
            model: Timeslot,
            as: 'timeslots',
            required: true,
            attributes: [
              'id',
              'startDate',
              'endDate',
              'duration',
              'cost',
              'maxParticipantsCount',
              'participantsCount',
              'cancelDate',
              'isCancelled',
            ],
            include: [
              {
                model: Participant,
                as: 'participants',
                attributes: ['id', 'timeslotId'],
              },
            ],
          },
        ],
      });
      return eventWithTimeslots;
    }

    const {
      selectedState = null,
      playerProfileId = null,
      coachProfileId = null,
      upcoming = false,
      completed = false,
      onlyFavorites = false,
      booked = false,
      limit = 20,
      offset = 0,
      withCancelled = false,
      includeDisabledBookings = true,
    } = eventQueryArgs;

    const filtersSet = eventFilterParams
      .filter((p) => p in eventQueryArgs && eventQueryArgs[p])
      .map((filterParam) => ({
        [filterParam]: eventQueryArgs[filterParam],
      }))
      .reduce((acc, filter) => ({ ...acc, ...filter }), {});

    if (onlyFavorites && playerProfileId) {
      const favCoaches = await FavoriteCoach.findAll({
        where: {
          playerProfileId,
        },
        attributes: ['playerProfileId', 'coachProfileId'],
      });
      const coachIds = favCoaches.map((fc) => fc.coachProfileId);

      const events = await Event.findAll({
        where: {
          profileId: coachIds,
          ...filtersSet,
        },
        order: completed
          ? [[{ model: Timeslot, as: 'timeslots' }, 'startDate', 'DESC']]
          : [[{ model: Timeslot, as: 'timeslots' }, 'startDate', 'ASC']],
        include: [
          ...(playerProfileId
            ? [
                {
                  model: Participant,
                  as: 'participants',
                  required: false,
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
                    'timeslotId',
                  ],
                },
              ]
            : []),
          {
            model: Timeslot,
            as: 'timeslots',
            required: true,
            where: {
              ...(withCancelled ? { cancelDate: null } : {}),
              ...(upcoming
                ? {
                    startDate: {
                      [Op.gt]: new Date(),
                    },
                  }
                : {}),
            },
          },
          {
            model: Profile,
            as: 'coach',
            ...(!includeDisabledBookings
              ? { where: { disabledBooking: false } }
              : {}),
          },
        ],
      });

      return {
        total: events.length,
        edges: events.map((x) => ({ node: x })),
      };
    }

    const params: { [key: string]: any } = {
      ...filtersSet,
      ...(coachProfileId || coachProfileId === 0
        ? { profileId: coachProfileId }
        : {}),
    };

    const timeslotAvailableInHours =
      typeof coachProfileId === 'number'
        ? 0
        : convertMsToHours(
            process.env.TIMESLOT_AVAILABLE_IN_MILLISECOND ||
              DEFAULT_AVAILABLE_TIME_IN_MS
          );

    const timeslotAvailableAfterHours = addHoursToDate(
      new Date(),
      timeslotAvailableInHours
    );

    const options = {
      type: QueryTypes.SELECT,
      mapToModel: true,
      nest: true,
      replacements: {
        date: new Date(),
        date_greater_than_hours: timeslotAvailableAfterHours,
      },
    };

    const [totalCount] = await db.query(
      `
      SELECT 
        count(DISTINCT("Event"."id")) AS "count"
        FROM "events" AS "Event" 
        INNER JOIN "timeslots" AS "timeslots" 
        ON "Event"."id" = "timeslots"."eventId"
        ${withCancelled ? '' : 'AND "timeslots"."cancelDate" IS NULL '}
        ${
          upcoming
            ? 'AND "timeslots"."startDate" > :date_greater_than_hours'
            : ''
        }
        ${completed ? 'AND "timeslots"."startDate" < :date' : ''}
        ${
          booked
            ? `
          INNER JOIN "participants" AS "timeslots->participants" 
          ON "timeslots"."id" = "timeslots->participants"."timeslotId"
          ${
            coachProfileId
              ? `AND "timeslots->participants"."coachId" = ${coachProfileId}`
              : ''
          }
          AND "timeslots->participants"."paid" = true
          LEFT OUTER JOIN "users" AS "timeslots->participants->client" 
          ON "timeslots->participants"."clientId" = "timeslots->participants->client"."id"
          LEFT OUTER JOIN "profiles" AS "timeslots->participants->client->profile" 
          ON "timeslots->participants->client"."id" = "timeslots->participants->client->profile"."userId"
        `
            : ''
        }
          INNER JOIN "profiles" AS "coach" ON "Event"."profileId" = "coach"."id"
         ${
           !!Object.keys(params)?.length
             ? 'where ' +
               Object.keys(params)
                 .map((paramKey) => {
                   return eventFilterParams.includes(paramKey)
                     ? `"Event"."${paramKey}"='${params[paramKey]}'`
                     : `"${paramKey}"='${params[paramKey]}'`;
                 })
                 .join(' AND ') +
               (selectedState
                 ? ` AND "coach"."state" = '${selectedState}'`
                 : '') +
               (!includeDisabledBookings
                 ? ` AND "coach"."disabledBooking" = false`
                 : '')
             : selectedState
             ? `where "coach"."state" = '${selectedState}'` +
               (!includeDisabledBookings
                 ? ` AND "coach"."disabledBooking" = false`
                 : '')
             : !includeDisabledBookings
             ? `where "coach"."disabledBooking" = false`
             : ''
         }
      `,
      {
        type: QueryTypes.RAW,
        replacements: {
          date: new Date(),
          date_greater_than_hours: timeslotAvailableAfterHours,
        },
      }
    );

    const rawEvents = await db.query(
      `
      SELECT 
      "Event".*, "timeslots"."id" AS "timeslots.id",
      "timeslots"."eventId" AS "timeslots.eventId", 
      "timeslots"."timeslot" AS "timeslots.timeslot",
      "timeslots"."startDate" AS "timeslots.startDate", 
      "timeslots"."endDate" AS "timeslots.endDate", 
      "timeslots"."duration" AS "timeslots.duration", 
      "timeslots"."cost" AS "timeslots.cost", 
      "timeslots"."maxParticipantsCount" AS "timeslots.maxParticipantsCount", 
      "timeslots"."participantsCount" AS "timeslots.participantsCount", 
      "timeslots"."isNotificationProcessed" AS "timeslots.isNotificationProcessed", 
      "timeslots"."isCancelled" AS "timeslots.isCancelled", 
      "timeslots"."cancelDate" AS "timeslots.cancelDate",
      "timeslots"."notificationDate" AS "timeslots.notificationDate"
      ${
        booked
          ? `,
        "timeslots->participants"."id" AS "timeslots.participants.id",
        "timeslots->participants"."eventId" AS "timeslots.participants.eventId",
        "timeslots->participants"."clientId" AS "timeslots.participants.clientId",
        "timeslots->participants"."coachId" AS "timeslots.participants.coachId",
        "timeslots->participants"."paymentReference" AS "timeslots.participants.paymentReference", 
        "timeslots->participants"."paymentIntent" AS "timeslots.participants.paymentIntent", 
        "timeslots->participants"."customer" AS "timeslots.participants.customer", 
        "timeslots->participants"."paid" AS "timeslots.participants.paid", 
        "timeslots->participants"."timezone" AS "timeslots.participants.timezone",
        "timeslots->participants->client"."id" AS "timeslots.participants.client.id",
        "timeslots->participants->client"."password" AS "timeslots.participants.client.password",
        "timeslots->participants->client"."email" AS "timeslots.participants.client.email",
        "timeslots->participants->client"."admin" AS "timeslots.participants.client.admin",
        "timeslots->participants->client"."token" AS "timeslots.participants.client.token",
        "timeslots->participants->client"."source" AS "timeslots.participants.client.source",
        "timeslots->participants->client"."termsOfService" AS "timeslots.participants.client.termsOfService", 
        "timeslots->participants->client"."privacyPolicy" AS "timeslots.participants.client.privacyPolicy",
        "timeslots->participants->client"."userType" AS "timeslots.participants.client.userType",
        "timeslots->participants->client"."sSocialId" AS "timeslots.participants.client.sSocialId",
        "timeslots->participants->client"."sSocialToken" AS "timeslots.participants.client.sSocialToken", 
        "timeslots->participants->client"."sSocialType" AS "timeslots.participants.client.sSocialType",
        "timeslots->participants->client"."createdAt" AS "timeslots.participants.client.createdAt",
        "timeslots->participants->client"."updatedAt" AS "timeslots.participants.client.updatedAt", 
        "timeslots->participants->client->profile"."id" AS "timeslots.participants.client.profile.id", 
        "timeslots->participants->client->profile"."name" AS "timeslots.participants.client.profile.name", 
        "timeslots->participants->client->profile"."sportId" AS "timeslots.participants.client.profile.sportId",
        "timeslots->participants->client->profile"."universityId" AS "timeslots.participants.client.profile.universityId",
        "timeslots->participants->client->profile"."city" AS "timeslots.participants.client.profile.city", 
        "timeslots->participants->client->profile"."state" AS "timeslots.participants.client.profile.state",
        "timeslots->participants->client->profile"."zip" AS "timeslots.participants.client.profile.zip",
        "timeslots->participants->client->profile"."primaryPositionId" AS "timeslots.participants.client.profile.primaryPositionId", 
        "timeslots->participants->client->profile"."secondaryPositionId" AS "timeslots.participants.client.profile.secondaryPositionId",
        "timeslots->participants->client->profile"."skill1Id" AS "timeslots.participants.client.profile.skill1Id", 
        "timeslots->participants->client->profile"."skill2Id" AS "timeslots.participants.client.profile.skill2Id",
        "timeslots->participants->client->profile"."skill3Id" AS "timeslots.participants.client.profile.skill3Id",
        "timeslots->participants->client->profile"."skill4Id" AS "timeslots.participants.client.profile.skill4Id",
        "timeslots->participants->client->profile"."skill" AS "timeslots.participants.client.profile.skill", 
        "timeslots->participants->client->profile"."rating" AS "timeslots.participants.client.profile.rating", 
        "timeslots->participants->client->profile"."gender" AS "timeslots.participants.client.profile.gender",
        "timeslots->participants->client->profile"."class" AS "timeslots.participants.client.profile.class", 
        "timeslots->participants->client->profile"."bio" AS "timeslots.participants.client.profile.bio", 
        "timeslots->participants->client->profile"."height" AS "timeslots.participants.client.profile.height",
        "timeslots->participants->client->profile"."weight" AS "timeslots.participants.client.profile.weight",
        "timeslots->participants->client->profile"."hometown" AS "timeslots.participants.client.profile.hometown",
        "timeslots->participants->client->profile"."cellphone" AS "timeslots.participants.client.profile.cellphone", 
        "timeslots->participants->client->profile"."isPhoneVerified" AS "timeslots.participants.client.profile.isPhoneVerified",
        "timeslots->participants->client->profile"."bannerImage" AS "timeslots.participants.client.profile.bannerImage", 
        "timeslots->participants->client->profile"."profileImage" AS "timeslots.participants.client.profile.profileImage",
        "timeslots->participants->client->profile"."userId" AS "timeslots.participants.client.profile.userId",
        "timeslots->participants->client->profile"."userType" AS "timeslots.participants.client.profile.userType",
        "timeslots->participants->client->profile"."verified" AS "timeslots.participants.client.profile.verified",
        "timeslots->participants->client->profile"."premium" AS "timeslots.participants.client.profile.premium",
        "timeslots->participants->client->profile"."hidden" AS "timeslots.participants.client.profile.hidden",
        "timeslots->participants->client->profile"."inflcr" AS "timeslots.participants.client.profile.inflcr",
        "timeslots->participants->client->profile"."referralSourceId" AS "timeslots.participants.client.profile.referralSourceId", 
        "timeslots->participants->client->profile"."createdAt" AS "timeslots.participants.client.profile.createdAt", 
        "timeslots->participants->client->profile"."updatedAt" AS "timeslots.participants.client.profile.updatedAt",
        "timeslots->participants->client->profile"."path" AS "timeslots.participants.client.profile.path" 
      `
          : ''
      }
      FROM (
          SELECT 
            "Event"."id",
            "Event"."geoAddressId",
            "Event"."profileId",
            "Event"."universityId",
            "Event"."sportId",
            "Event"."skillId", 
            "Event"."mediaId", 
            "Event"."max",
            "Event"."duration",
            "Event"."sessionType",
            "Event"."timezone",
            "Event"."location",
            "Event"."title",
            "Event"."description",
            "Event"."isNotificationProcessed",
            "Event"."isEventCancelled",
            "Event"."eventCancelDate",
            "Event"."notificationDate",
            "Event"."dailyReminderAt",
            "Event"."createdAt",
            "Event"."updatedAt", 
            "Event"."positionId", 
            ${
              !completed
                ? '"Event"."participantsCount","Event"."eventType", "Event"."cost", "Event"."date",'
                : ''
            }
          "coach"."id" AS "coach.id", "coach"."name" AS "coach.name", "coach"."sportId" AS "coach.sportId", "coach"."universityId" AS "coach.universityId", "coach"."city" AS "coach.city", "coach"."state" AS "coach.state", "coach"."zip" AS "coach.zip", "coach"."primaryPositionId" AS "coach.primaryPositionId", "coach"."secondaryPositionId" AS "coach.secondaryPositionId", "coach"."skill1Id" AS "coach.skill1Id", "coach"."skill2Id" AS "coach.skill2Id", "coach"."skill3Id" AS "coach.skill3Id", "coach"."skill4Id" AS "coach.skill4Id", "coach"."skill" AS "coach.skill", "coach"."rating" AS "coach.rating", "coach"."gender" AS "coach.gender", "coach"."class" AS "coach.class", "coach"."bio" AS "coach.bio", "coach"."height" AS "coach.height", "coach"."weight" AS "coach.weight", "coach"."hometown" AS "coach.hometown", "coach"."cellphone" AS "coach.cellphone", "coach"."isPhoneVerified" AS "coach.isPhoneVerified", "coach"."bannerImage" AS "coach.bannerImage", "coach"."profileImage" AS "coach.profileImage", "coach"."userId" AS "coach.userId", "coach"."userType" AS "coach.userType", "coach"."verified" AS "coach.verified", "coach"."premium" AS "coach.premium", "coach"."hidden" AS "coach.hidden", "coach"."inflcr" AS "coach.inflcr", "coach"."referralSourceId" AS "coach.referralSourceId", "coach"."createdAt" AS "coach.createdAt", "coach"."updatedAt" AS "coach.updatedAt", "coach"."path" AS "coach.path",
          MIN("timeslots"."startDate") as "startDate"
          FROM "events" AS "Event" 
          INNER JOIN "profiles" AS "coach"
          ON "Event"."profileId" = "coach"."id"
          JOIN
            (SELECT "timeslots"."eventId", "timeslots"."startDate"
              FROM "timeslots"
              ${
                booked
                  ? `
              INNER JOIN "participants" AS "participants" 
              ON "timeslots"."id" = "participants"."timeslotId" 
              ${
                coachProfileId
                  ? `AND "participants"."coachId" = ${coachProfileId}`
                  : ''
              }
              AND "participants"."paid" = true
              `
                  : ''
              }
              ${withCancelled || upcoming || completed ? 'WHERE ' : ''}
              ${withCancelled ? '' : '"timeslots"."cancelDate" IS NULL '}
              ${!withCancelled ? 'AND ' : ''}
              ${
                upcoming
                  ? '"timeslots"."startDate" > :date_greater_than_hours'
                  : ''
              }
              ${completed ? 'AND "timeslots"."startDate" < :date' : ''}
            ) "timeslots" ON "timeslots"."eventId" = "Event"."id"
          AND ( 
              SELECT "timeslots"."eventId" FROM "timeslots" AS "timeslots" 
              ${
                booked
                  ? `
              INNER JOIN "participants" AS "participants" 
              ON "timeslots"."id" = "participants"."timeslotId" 
              ${
                coachProfileId
                  ? `AND "participants"."coachId" = ${coachProfileId}`
                  : ''
              }
              AND "participants"."paid" = true
              `
                  : ''
              }
              WHERE ((
                ${withCancelled ? '' : '"timeslots"."cancelDate" IS NULL'}
                ${!withCancelled ? 'AND ' : ''}
                  ${
                    upcoming
                      ? '"timeslots"."startDate" > :date_greater_than_hours'
                      : ''
                  }
                  ${completed ? 'AND "timeslots"."startDate" < :date' : ''}
                  )
                     AND "timeslots"."eventId" = "Event"."id") LIMIT 1 )
          IS NOT NULL
          ${
            !!Object.keys(params)?.length
              ? 'where ' +
                Object.keys(params)
                  .map((paramKey) => {
                    return eventFilterParams.includes(paramKey)
                      ? `"Event"."${paramKey}"='${params[paramKey]}'`
                      : `"${paramKey}"='${params[paramKey]}'`;
                  })
                  .join(' AND ') +
                (selectedState
                  ? ` AND "coach"."state" = '${selectedState}'`
                  : '') +
                (!includeDisabledBookings
                  ? ` AND "coach"."disabledBooking" = false`
                  : '')
              : selectedState
              ? `where "coach"."state" = '${selectedState}'` +
                (!includeDisabledBookings
                  ? ` AND "coach"."disabledBooking" = false`
                  : '')
              : !includeDisabledBookings
              ? `where "coach"."disabledBooking" = false`
              : ''
          }
          group by "Event"."id", "coach.id"
          order by "startDate" ${completed ? 'DESC' : 'ASC'}
          ${limit ? `LIMIT ${limit}` : ''} ${
        offset || offset === 0 ? `OFFSET ${offset}` : ''
      }
      ) 
      AS "Event"
          INNER JOIN "timeslots" AS "timeslots" ON "Event"."id" = "timeslots"."eventId"
          ${withCancelled ? '' : ' AND "timeslots"."cancelDate" IS NULL '}
          ${
            upcoming
              ? 'AND "timeslots"."startDate" > :date_greater_than_hours'
              : ''
          }
          ${completed ? 'AND "timeslots"."startDate" < :date' : ''}
          ${
            booked
              ? `
          INNER JOIN "participants" AS
          "timeslots->participants" ON "timeslots"."id" = "timeslots->participants"."timeslotId" 
          ${
            coachProfileId
              ? `AND "timeslots->participants"."coachId" = ${coachProfileId}`
              : ''
          }
          AND "timeslots->participants"."paid" = true
          LEFT OUTER JOIN "users" AS "timeslots->participants->client" 
          ON "timeslots->participants"."clientId" = "timeslots->participants->client"."id"
          LEFT OUTER JOIN "profiles" AS "timeslots->participants->client->profile"
          ON "timeslots->participants->client"."id" = "timeslots->participants->client->profile"."userId"
          `
              : ''
          }
          ORDER BY "timeslots"."startDate" ${completed ? 'DESC' : 'ASC'}
    `,
      options
    );

    if (!(Array.isArray(rawEvents) && rawEvents.length > 0)) {
      return {
        totalCount: 0,
        edges: [],
      };
    }

    let updateRawEvents = flatMapAnArray('timeslots', rawEvents);

    if (booked) {
      updateRawEvents = updateRawEvents.map((event: any) => {
        if (Array.isArray(event.timeslots) && event.timeslots.length > 1) {
          return {
            ...event,
            timeslots: flatMapAnArray('participants', event.timeslots),
          };
        }

        return event;
      });
    }

    const mappedEvent = Event.build(updateRawEvents as any, {
      include: [
        {
          model: Profile,
          as: 'coach',
        },
        {
          model: Timeslot,
          as: 'timeslots',
          include: [
            ...(booked
              ? [
                  {
                    model: Participant,
                    as: 'participants',
                    include: [
                      {
                        model: User,
                        as: 'client',
                        include: [
                          {
                            model: Profile,
                            as: 'profile',
                          },
                        ],
                      },
                    ],
                  },
                ]
              : []),
          ],
        },
      ],
    });

    if (!(Array.isArray(mappedEvent) && mappedEvent.length > 0)) {
      return {
        totalCount: 0,
        edges: [],
      };
    }

    return {
      total: Array.isArray(totalCount) ? totalCount[0].count : 0,
      edges: mappedEvent.map((x) => ({
        node: x,
      })),
    };
  },
};

export { eventQuery };
export default { eventQuery };
