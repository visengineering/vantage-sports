const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = require('graphql');

const UniversityType = new GraphQLObjectType({
  name: 'University',
  description: 'This represents a University',
  fields: () => ({
    id: { type: GraphQLInt, resolve: (university: any) => university.id },
    name: {
      type: GraphQLString,
      resolve: (university: any) => university.name,
    },
    createdAt: {
      type: GraphQLString,
      resolve: (university: any) => university.createdAt,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (university: any) => university.updatedAt,
    },
  }),
});

export { UniversityType };
export default { UniversityType };
