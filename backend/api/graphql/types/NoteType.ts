const { GraphQLObjectType, GraphQLInt, GraphQLString } = require('graphql');

const NoteType = new GraphQLObjectType({
  name: 'Note',
  description: 'This represents a Note',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve: (note: any) => note.id,
    },
    userId: {
      type: GraphQLInt,
      resolve: (note: any) => note.userId,
    },
    note: {
      type: GraphQLString,
      resolve: (note: any) => note.note,
    },
    createdAt: {
      type: GraphQLString,
      resolve: (note: any) => note.createdAt,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (note: any) => note.createdAt,
    },
  }),
});

export { NoteType };
export default { NoteType };
