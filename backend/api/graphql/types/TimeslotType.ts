import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

import { Timeslot } from '../../models';

import { EventType } from './EventType';
import { ParticipantType } from './ParticipantType';

export const TimeslotType: GraphQLObjectType<
  Timeslot | GraphQLObjectType<Timeslot>
> = new GraphQLObjectType<Timeslot | GraphQLObjectType<Timeslot>>({
  name: 'Timeslot',
  description: 'This represents a Timeslot',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve: (timeslot: any) =>
        timeslot?.node ? timeslot.node.id : timeslot.id,
    },
    event: {
      type: EventType,
      resolve: (timeslot: any) =>
        timeslot?.node ? timeslot.node.getEvent() : timeslot.getEvent(),
    },
    startDate: {
      type: GraphQLDateTime as any,
      resolve: (timeslot: any) =>
        timeslot?.node ? timeslot.node.startDate : timeslot.startDate,
    },
    endDate: {
      type: GraphQLDateTime as any,
      resolve: (timeslot: any) =>
        timeslot?.node ? timeslot.node.endDate : timeslot.endDate,
    },
    duration: {
      type: GraphQLFloat,
      resolve: (timeslot: any) =>
        timeslot?.node ? timeslot.node.duration : timeslot.duration,
    },
    cost: {
      type: GraphQLFloat,
      resolve: (timeslot: any) =>
        timeslot?.node ? timeslot.node.cost : timeslot.cost,
    },
    maxParticipantsCount: {
      type: GraphQLInt,
      resolve: (timeslot: any) =>
        timeslot?.node
          ? timeslot.node.maxParticipantsCount
          : timeslot.maxParticipantsCount,
    },
    participantsCount: {
      type: GraphQLInt,
      resolve: (timeslot: any) =>
        timeslot?.node
          ? timeslot.node.participantsCount
          : timeslot.participantsCount,
    },
    isNotificationProcessed: {
      type: GraphQLBoolean,
      resolve: (timeslot: any) =>
        timeslot?.node
          ? timeslot.node.isNotificationProcessed
          : timeslot.isNotificationProcessed,
    },
    notificationDate: {
      type: GraphQLDateTime as any,
      resolve: (timeslot: any) =>
        timeslot?.node
          ? timeslot.node.notificationDate
          : timeslot.notificationDate,
    },
    isCancelled: {
      type: GraphQLBoolean,
      resolve: (timeslot: any) =>
        timeslot?.node ? timeslot.node.isCancelled : timeslot.isCancelled,
    },
    cancelDate: {
      type: GraphQLDateTime as any,
      resolve: (timeslot: any) =>
        timeslot?.node ? timeslot.node.cancelDate : timeslot.cancelDate,
    },
    participants: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(ParticipantType))
      ),
      resolve: async (timeslot: any) =>
        timeslot?.node ? timeslot.node.participants : timeslot.participants,
    },
  }),
});

export const TimeslotEdgeType: GraphQLObjectType<Timeslot> =
  new GraphQLObjectType<Timeslot>({
    name: 'TimeslotEdge',
    fields: () => ({
      node: { type: TimeslotType, resolve: (timeslot: Timeslot) => timeslot },
    }),
  });

export const TimeslotConnectionType: GraphQLObjectType<
  typeof TimeslotEdgeType
> = new GraphQLObjectType<typeof TimeslotEdgeType>({
  name: 'TimeslotConnection',
  fields: () => ({
    edges: { type: new GraphQLList(TimeslotEdgeType) },
    total: { type: GraphQLInt },
  }),
});
