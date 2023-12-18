import merge from 'lodash.merge';
import pickBy from 'lodash.pickby';
const { GraphQLInt, GraphQLString, GraphQLUnionType } = require('graphql');

import { CoachType, CoachConnectionType } from '../types';
import { Profile } from '../../models';
import { GraphQLBoolean } from 'graphql';
import { FavoriteCoach } from '../../models';

const coachQuery = {
  type: new GraphQLUnionType({
    name: 'CoachUnion',
    types: [CoachType, CoachConnectionType],
    resolveType(value: any) {
      return value instanceof Profile ? CoachType : CoachConnectionType;
    },
  }),
  args: {
    id: { name: 'id', type: GraphQLInt },
    universityId: { name: 'university', type: GraphQLInt },
    sportId: { name: 'sportId', type: GraphQLInt },
    onlyFavorites: { name: 'onlyFavorites', type: GraphQLBoolean },
    playerProfileId: { name: 'playerProfileId', type: GraphQLInt },
    name: { name: 'name', type: GraphQLString },
    limit: { name: 'limit', type: GraphQLInt },
    offset: { name: 'offset', type: GraphQLInt },
    path: { name: 'path', type: GraphQLString },
  },
  resolve: async (coach: any, args: any) => {
    if (args.id) {
      return await Profile.findByPk(args.id);
    } else if (args.path) {
      return await Profile.findOne({
        where: {
          path: args.path,
        },
      });
    } else {
      const { limit, offset, onlyFavorites, playerProfileId, ...whereArgs } =
        args;
      const query = {
        ...(limit ? { limit } : {}),
        where: {
          ...merge(pickBy(whereArgs), {
            userType: '1',
            hidden: null,
          }),
        },
        ...(onlyFavorites
          ? {
              include: [
                {
                  model: FavoriteCoach,
                  as: 'favoritedBy',
                  required: true,
                  where: {
                    playerProfileId,
                  },
                },
              ],
            }
          : {}),
        distinct: true,
        offset,
        order: [
          ['premium', 'DESC NULLS LAST'],
          ['id', 'DESC'],
        ],
      };
      const coaches = await Profile.findAndCountAll(query as any);
      return {
        total: coaches.count,
        edges: coaches.rows.map((x) => ({ node: x })),
      };
    }
  },
};
export { coachQuery };
export default { coachQuery };
