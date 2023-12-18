const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
} = require('graphql');
import { User } from '../../models';
import { CoachType } from './CoachType';
import { EventType } from './EventType';
import { ReviewType } from './ReviewType';
import { TimeslotType } from './TimeslotType';
import { UserType } from './UserType';

const ParticipantType = new GraphQLObjectType({
  name: 'Participant',
  description: 'This represents a Participant',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve: (participant: any) =>
        participant.node ? participant.node.id : participant.id,
    },
    client: {
      type: UserType,
      resolve: async (participant: any) => {
        return await User.findByPk(
          parseInt(
            participant.node ? participant.node.clientId : participant.clientId
          )
        );
      },
    },
    coach: {
      type: CoachType,
      resolve: (participant: any) =>
        participant.node ? participant.node.getCoach() : participant.getCoach(),
    },
    event: {
      type: EventType,
      resolve: (participant: any) =>
        participant.node
          ? participant.node.getEvents()
          : participant.getEvents(),
    },
    timeslot: {
      type: TimeslotType,
      resolve: (participant: any) =>
        participant.node
          ? participant.node.getTimeslot()
          : participant.getTimeslot(),
    },
    paymentReference: {
      type: GraphQLString,
      resolve: (participant: any) =>
        participant.node
          ? participant.node.paymentReference
          : participant.paymentReference,
    },
    review: {
      type: ReviewType,
      resolve: (participant: any) =>
        participant.node
          ? participant.node.getReview()
          : participant.getReview(),
    },
    paid: {
      type: GraphQLBoolean,
      resolve: (participant: any) =>
        participant.node ? participant.node.paid : participant.paid,
    },
    createdAt: {
      type: GraphQLString,
      resolve: (participant: any) =>
        participant.node ? participant.node.createdAt : participant.createdAt,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (participant: any) =>
        participant.node ? participant.node.updatedAt : participant.updatedAt,
    },
  }),
});

const ParticipantEdgeType = new GraphQLObjectType({
  name: 'ParticipantEdge',
  fields: () => ({
    node: { type: ParticipantType, resolve: (participant: any) => participant },
  }),
});

const ParticipantConnectionType = new GraphQLObjectType({
  name: 'ParticipantConnection',
  fields: () => ({
    edges: { type: new GraphQLList(ParticipantEdgeType) },
    total: { type: GraphQLInt },
  }),
});

export { ParticipantType, ParticipantEdgeType, ParticipantConnectionType };

export default {
  ParticipantType,
  ParticipantEdgeType,
  ParticipantConnectionType,
};
