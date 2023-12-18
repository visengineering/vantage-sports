import _ from 'underscore';
import { Op } from 'sequelize';

import { ParticipantType, ParticipantConnectionType } from '../types/index';
import { Participant, Review, Event, Profile, Timeslot } from '../../models';

// TODO: Currently graphql types are not correctly picked up by TypeScript
const { GraphQLInt, GraphQLBoolean, GraphQLUnionType } = require('graphql');

export const participantQuery = {
  type: new GraphQLUnionType({
    name: 'ParticipantUnion',
    types: [ParticipantType, ParticipantConnectionType],
    resolveType(value: unknown) {
      return value instanceof Participant
        ? ParticipantType
        : ParticipantConnectionType;
    },
  }),
  args: {
    id: { name: 'id', type: GraphQLInt },
    playerId: { name: 'playerId', type: GraphQLInt },
    coachId: { name: 'coachId', type: GraphQLInt },
    completed: { name: 'completed', type: GraphQLBoolean },
    limit: { name: 'limit', type: GraphQLInt },
    offset: { name: 'offset', type: GraphQLInt },
  },
  resolve: async (event: any, { limit = null, offset, ...args }: any) => {
    if (args?.id != null) {
      return await Participant.findByPk(parseInt(args.id));
    }
    const participants = await Participant.findAndCountAll({
      ...(offset ? { offset } : {}),
      ...(limit ? { limit } : { limit: 20 }),
      where: {
        paid: true,
        paymentReference: { [Op.ne]: null },
        ...(args.playerId || args.playerId === 0
          ? {
              clientId: parseInt(args.playerId),
            }
          : {}),
        ...(args.coachId || args.coachId === 0
          ? {
              coachId: parseInt(args.coachId),
            }
          : {}),
      },
      distinct: true,
      include: args.playerId
        ? [
            { model: Review, as: 'review', required: false },
            {
              model: Event,
              as: 'events',
              include: [{ model: Profile, as: 'coach' }],
            },
            {
              model: Timeslot,
              as: 'timeslot',
              where: args.completed
                ? {
                    startDate: {
                      // This does not take into account the timeslot length
                      // We are considering completed any timeslot that has started
                      // This might not be super right, but is much better than
                      // filtering in JavaScript (as it breaks pagination)
                      [Op.lt]: new Date(),
                    },
                    cancelDate: null,
                  }
                : {},
            },
          ]
        : [],
      order:
        args.playerId || args.playerId === 0
          ? [[{ model: Timeslot, as: 'timeslot' }, 'startDate', 'DESC']]
          : [['updatedAt', 'DESC'] as [string, string]],
    });

    const totalCount = Array.isArray(participants.count)
      ? participants.count.length
      : participants.count;
    return {
      total: totalCount,
      edges: participants.rows.map((x: Participant) => ({ node: x })),
    };
  },
};
export default participantQuery;
