const { GraphQLInt, GraphQLList } = require('graphql');

import { SportType } from '../types';
import { Sport } from '../../models';

const sportQuery = {
  type: new GraphQLList(SportType),
  args: {
    id: {
      name: 'id',
      type: GraphQLInt,
    },
  },
  resolve: async (sport: any, args: any) => {
    let sportData = null;
    let sportsList = [];
    const sportId = args.id && parseInt(args.id);

    if (sportId) {
      sportData = await Sport.findByPk(sportId);
      return sportData ? [sportData] : [];
    }

    sportsList = await Sport.findAll();
    return sportsList;
  },
};

export { sportQuery };
export default { sportQuery };
