const { GraphQLInt, GraphQLString, GraphQLList } = require('graphql');

import { UserType } from '../types';
import { User, Profile } from '../../models';

const userQuery = {
  type: new GraphQLList(UserType),
  args: {
    id: { name: 'id', type: GraphQLInt },
    email: { name: 'email', type: GraphQLString },
    // notes: { name: "notes", type: GraphQLString },
    // createdAt: { name: "createdAt", type: GraphQLString },
    // updatedAt: { name: "updatedAt", type: GraphQLString },
  },
  resolve: async (user: any, args: any) => {
    let userData = null;
    const userId = args.id && parseInt(args.id);

    if (userId) {
      userData = await User.findByPk(userId);
      return userData ? [userData] : [];
    }

    if (args.email) {
      return userData ? [userData] : [];
    }

    const usersList = await User.findAll({});
    return usersList;
  },
};
export { userQuery };
export default { userQuery };
