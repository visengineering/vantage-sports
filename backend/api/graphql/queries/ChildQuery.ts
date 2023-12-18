import { Profile, Child } from '../../models';
import { ChildType, ChildConnectionType } from '../types/ChildType';

const { GraphQLInt, GraphQLUnionType } = require('graphql');

export const childQuery = {
  type: new GraphQLUnionType({
    name: 'ChildUnion',
    types: [ChildType, ChildConnectionType],
    resolveType(value: unknown) {
      return value instanceof Child ? ChildType : ChildConnectionType;
    },
  }),
  args: {
    id: { name: 'id', type: GraphQLInt },
    parentProfileId: { name: 'parentProfileId', type: GraphQLInt },
    limit: { name: 'limit', type: GraphQLInt },
    offset: { name: 'offset', type: GraphQLInt },
  },
  resolve: async (child: any, { limit = null, offset, ...args }: any) => {
    if (args?.id != null) {
      return await Child.findByPk(parseInt(args.id));
    }
    const children = await Child.findAndCountAll({
      ...(offset ? { offset } : {}),
      ...(limit ? { limit } : { limit: 20 }),
      where: {
        ...(args.parentProfileId || args.parentProfileId === 0
          ? {
              parentProfileId: parseInt(args.parentProfileId),
            }
          : {}),
      },
      distinct: true,
      include: args.parentProfileId
        ? [{ model: Profile, as: 'parent', required: true }]
        : [],
      order: [['updatedAt', 'DESC'] as [string, string]],
    });

    const totalCount = Array.isArray(children.count)
      ? children.count.length
      : children.count;
    return {
      total: totalCount,
      edges: children.rows.map((x: Child) => ({ node: x })),
    };
  },
};

export default childQuery;
