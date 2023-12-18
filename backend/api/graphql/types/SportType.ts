const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = require('graphql');

const SportType = new GraphQLObjectType({
  name: 'Sport',
  description: 'This represents a Sport',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve: (sport: any) => sport.id,
    },
    name: {
      type: GraphQLString,
      resolve: (sport: any) => sport.name,
    },
    createdAt: {
      type: GraphQLString,
      resolve: (sport: any) => sport.createdAt,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (sport: any) => sport.updatedAt,
    },
  }),
});

export { SportType };
export default { SportType };
