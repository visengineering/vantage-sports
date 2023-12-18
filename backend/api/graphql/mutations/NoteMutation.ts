const { GraphQLString, GraphQLInt, GraphQLNonNull } = require('graphql');
import merge from 'lodash.merge';

import { NoteType } from '../types';
import { Note } from '../../models';

const createNote = {
  type: NoteType,
  description: 'The mutation that allows you to create a new Note',
  args: {
    note: {
      name: 'note',
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (value: any, { note }: any) =>
    Note.create({
      note,
    }),
};

const updateNote = {
  type: NoteType,
  description: 'The mutation that allows you to update an existing Note by Id',
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLInt),
    },

    note: {
      name: 'note',
      type: GraphQLString,
    },
  },
  resolve: async (value: any, { id, note }: any) => {
    const foundNote = await Note.findByPk(id);

    if (!foundNote) {
      throw new Error(`Note with id: ${id} not found!`);
    }

    const updatedNote = merge(foundNote, {
      note,
    });

    return foundNote.update(updatedNote);
  },
};

const deleteNote = {
  type: NoteType,
  description: 'The mutation that allows you to delete a existing Note by Id',
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  resolve: async (value: any, { id }: any) => {
    const foundNote = await Note.findByPk(id);

    if (!foundNote) {
      throw new Error(`Note with id: ${id} not found!`);
    }

    await Note.destroy({
      where: {
        id,
      },
    });

    return foundNote;
  },
};

export { createNote, updateNote, deleteNote };
export default { createNote, updateNote, deleteNote };
