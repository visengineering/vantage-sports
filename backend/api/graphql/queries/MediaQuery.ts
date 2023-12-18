const { GraphQLInt, GraphQLString, GraphQLUnionType } = require('graphql');

import { MediaType, MediaConnectionType } from '../types';
import { Media } from '../../models';

const mediaQuery = {
  type: new GraphQLUnionType({
    name: 'MediaUnion',
    types: [MediaType, MediaConnectionType],
    resolveType(value: unknown) {
      return value instanceof Media ? MediaType : MediaConnectionType;
    },
  }),
  args: {
    id: { name: 'id', type: GraphQLInt },
    name: { name: 'name', type: GraphQLString },
    type: { name: 'id', type: GraphQLString },
    externalId: { name: 'externalId', type: GraphQLString },
    eventId: { name: 'eventId', type: GraphQLInt },
    profileId: { name: 'profileId', type: GraphQLInt },
    contentId: { name: 'contentId', type: GraphQLInt },
    createdAt: { name: 'createdAt', type: GraphQLString },
    updatedAt: { name: 'updatedAt', type: GraphQLString },
    limit: { name: 'limit', type: GraphQLInt },
    offset: { name: 'offset', type: GraphQLInt },
  },
  resolve: async (
    media: any,
    { limit = null, offset = null, ...mediaWhereQuery }: any
  ) => {
    const mediaQuery = {
      ...(offset ? { offset } : {}),
      ...(limit ? { limit } : { limit: 20 }),
      where: mediaWhereQuery,
      distinct: true,
    };
    const allMedia = await Media.findAndCountAll(mediaQuery);
    const totalCount = Array.isArray(allMedia.count)
      ? allMedia.count.length
      : allMedia.count;
    return {
      total: totalCount,
      edges: allMedia.rows.map((x) => ({ node: x })),
    };
  },
};

export { mediaQuery };
export default { mediaQuery };
