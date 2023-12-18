const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = require('graphql');

const PositionType = new GraphQLObjectType({
  name: 'Position',
  description: 'This represents a Position',
  fields: () => ({
    id: { type: GraphQLInt, resolve: (position: any) => position.id },
    name: { type: GraphQLString, resolve: (position: any) => position.name },
    createdAt: {
      type: GraphQLString,
      resolve: (position: any) => position.createdAt,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (position: any) => position.updatedAt,
    },
  }),
});

export { PositionType };
export default { PositionType };
