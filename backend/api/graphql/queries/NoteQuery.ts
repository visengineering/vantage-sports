const { GraphQLInt, GraphQLString, GraphQLList } = require('graphql');

import { NoteType } from '../types';
import { Note } from '../../models';

const noteQuery = {
  type: new GraphQLList(NoteType),
  args: {
    id: {
      name: 'id',
      type: GraphQLInt,
    },
    note: {
      name: 'note',
      type: GraphQLString,
    },
    createdAt: {
      name: 'createdAt',
      type: GraphQLString,
    },
    updatedAt: {
      name: 'updatedAt',
      type: GraphQLString,
    },
  },
  resolve: (note: any, args: any) => Note.findAll({ where: args }),
};

export { noteQuery };
export default { noteQuery };
