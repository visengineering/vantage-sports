const { GraphQLString, GraphQLInt, GraphQLNonNull } = require('graphql');
import merge from 'lodash.merge';

import { MediaType } from '../types';
import { MediaInputType } from '../inputTypes';
import { Media } from '../../models';

const createMedia = {
  type: MediaType,
  description: 'The mutation that allows you to create a new media',
  args: {
    media: {
      name: 'media',
      type: MediaInputType('create'),
    },
  },
  resolve: async (value: any, { media }: any) => {
    const newMedia = await Media.create(media);
    return newMedia;
  },
};

const deleteMedia = {
  type: MediaType,
  description: 'The mutation that allows you to delete a existing Media by Id',
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  resolve: async (value: any, { id }: any) => {
    const foundMedia = await Media.findByPk(id);

    if (!foundMedia) {
      throw new Error(`Media with id: ${id} not found!`);
    }

    await Media.destroy({
      where: {
        id,
      },
    });

    return foundMedia;
  },
};

export { createMedia, deleteMedia };
export default { createMedia, deleteMedia };
