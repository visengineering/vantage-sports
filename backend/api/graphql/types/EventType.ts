import { GraphQLDateTime } from 'graphql-iso-date';
import { CoachType } from './CoachType';
import { SportType } from './SportType';
import { SkillType } from './SkillType';
import { UniversityType } from './UniversityType';
import { MediaType } from './MediaType';
import { PositionType } from './PositionType';
import { TimeslotType } from './TimeslotType';
import { GeoAddressType } from './GeoAddressType';
import { Event } from '../../models';

import {
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

/* TODO: improve types */
const EventType: GraphQLObjectType<Event | GraphQLObjectType<Event>> =
  new GraphQLObjectType<Event | GraphQLObjectType<Event>>({
    name: 'Event',
    description: 'This represents a Event',
    fields: () => ({
      id: {
        type: GraphQLInt,
        resolve: (event: any) => (event.node ? event.node.id : event.id),
      },
      geoAddressId: {
        type: GraphQLInt,
        resolve: (event: any) =>
          event.node ? event.node.geoAddressId : event.geoAddressId,
      },
      geoAddress: {
        type: GeoAddressType,
        resolve: (event: any) =>
          event.node
            ? event.node.getEventGeoAddress()
            : event.getEventGeoAddress(),
      },
      coach: {
        type: CoachType,
        resolve: async (event: any) =>
          event.node ? event.node.getCoach() : event.getCoach(),
      },
      timeslots: {
        type: new GraphQLNonNull(
          new GraphQLList(new GraphQLNonNull(TimeslotType))
        ),
        resolve: async (event: any) =>
          event?.node ? event.node.timeslots : event.timeslots,
      },
      university: {
        type: UniversityType,
        resolve: (event: any) =>
          event.node ? event.node.getUniversity() : event.getUniversity(),
      },
      sport: {
        type: SportType,
        resolve: (event: any) =>
          event.node ? event.node.getSport() : event.getSport(),
      },
      skill: {
        type: SkillType,
        resolve: (event: any) =>
          event.node ? event.node.getSkill() : event.getSkill(),
      },
      media: {
        type: MediaType,
        resolve: (event: any) =>
          event.node ? event.node.getMedia() : event.getMedia(),
      },
      position: {
        type: PositionType,
        resolve: (event: any) =>
          event.node ? event.node.getPosition() : event.getPosition(),
      },
      max: {
        type: GraphQLInt,
        resolve: (event: any) => (event.node ? event.node.max : event.max),
      },
      duration: {
        type: GraphQLFloat,
        resolve: (event: any) =>
          event.node ? event.node.duration : event.duration,
      },
      sessionType: {
        type: GraphQLString,
        resolve: (event: any) =>
          event.node ? event.node.sessionType : event.sessionType,
      },
      cost: {
        type: GraphQLFloat,
        resolve: (event: any) => (event.node ? event.node.cost : event.cost),
      },
      participantsCount: {
        type: GraphQLFloat,
        resolve: (event: any) =>
          event.node ? event.node.participantsCount : event.participantsCount,
      },
      count: {
        type: GraphQLInt,
        resolve: (event: any) =>
          event.node
            ? event.node.countParticipants()
            : event.countParticipants(),
      },
      date: {
        type: GraphQLDateTime as any,
        resolve: (event: any) => (event.node ? event.node.date : event.date),
      },
      timezone: {
        type: GraphQLString,
        resolve: (event: any) =>
          event.node ? event.node.timezone : event.timezone,
      },
      location: {
        type: GraphQLString,
        resolve: (event: any) =>
          event.node ? event.node.location : event.location,
      },
      title: {
        type: GraphQLString,
        resolve: (event: any) => (event.node ? event.node.title : event.title),
      },
      description: {
        type: GraphQLString,
        resolve: (event: any) =>
          event.node ? event.node.description : event.description,
      },
      isEventCancelled: {
        type: GraphQLBoolean,
        resolve: (event: any) =>
          event.node ? event.node.isEventCancelled : event.isEventCancelled,
      },
      isNotificationProcessed: {
        type: GraphQLBoolean,
        resolve: (event: any) =>
          event.node
            ? event.node.isNotificationProcessed
            : event.isNotificationProcessed,
      },
      notificationDate: {
        type: GraphQLDateTime as any,
        resolve: (event: any) =>
          event.node ? event.node.eventCancelDate : event.eventCancelDate,
      },
      dailyReminderAt: {
        type: GraphQLDateTime as any,
        resolve: (event: any) =>
          event.node ? event.node.dailyReminderAt : event.dailyReminderAt,
      },
      eventCancelDate: {
        type: GraphQLDateTime as any,
        resolve: (event: any) =>
          event.node ? event.node.eventCancelDate : event.eventCancelDate,
      },
      eventType: {
        type: GraphQLString,
        resolve: (event: any) =>
          event.node ? event.node.eventType : event.eventType,
      },
      createdAt: {
        type: GraphQLString,
        resolve: (event: any) =>
          event.node ? event.node.createdAt : event.createdAt,
      },
      updatedAt: {
        type: GraphQLString,
        resolve: (event: any) =>
          event.node ? event.node.updatedAt : event.updatedAt,
      },
    }),
  });

const EventEdgeType: GraphQLObjectType<Event> = new GraphQLObjectType<Event>({
  name: 'EventEdge',
  fields: () => ({
    node: { type: EventType, resolve: (event: Event) => event },
  }),
});

const EventConnectionType: GraphQLObjectType<typeof EventEdgeType> =
  new GraphQLObjectType<typeof EventEdgeType>({
    name: 'EventConnection',
    fields: () => ({
      edges: { type: new GraphQLList(EventEdgeType) },
      total: { type: GraphQLInt },
    }),
  });

export { EventType, EventEdgeType, EventConnectionType };
export default { EventType, EventEdgeType, EventConnectionType };
