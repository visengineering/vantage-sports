const { GraphQLInt, GraphQLList } = require('graphql');

import { ProfileType } from '../types';
import { Profile } from '../../models';

const profileQuery = {
  type: new GraphQLList(ProfileType),
  args: {
    id: { name: 'id', type: GraphQLInt },
    userId: { name: 'userId', type: GraphQLInt },
  },
  resolve: async (profile: any, args: { id?: number; userId?: number }) => {
    if (args.id) {
      const profileFound = await Profile.findByPk(args.id);
      return profileFound ? [profileFound] : [];
    }
    if (args.userId) {
      const profileFound = await Profile.findOne({
        where: { userId: args.userId },
      });
      return profileFound ? [profileFound] : [];
    }

    return await Profile.findAll();
  },
};
export { profileQuery };
export default { profileQuery };
