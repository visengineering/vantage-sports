import { Profile } from '../../models';
import { ProfileType } from './ProfileType';

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = require('graphql');

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'This represents a User',
  fields: () => ({
    id: { type: GraphQLInt, resolve: (user: any) => user.id },
    email: { type: GraphQLString, resolve: (user: any) => user.email },
    // profileId: { type: GraphQLInt, resolve: (user:any) => user.profileId, },
    profile: {
      type: ProfileType,
      resolve: async (user: any) => {
        return await Profile.findOne({
          where: {
            userId: parseInt(user.node ? user.node.id : user.id),
          },
        });
      },
    },
    // notes: { type: new GraphQLList(NoteType), resolve: (user:any) => user.getNotes(), },
    createdAt: { type: GraphQLString, resolve: (user: any) => user.createdAt },
    updatedAt: { type: GraphQLString, resolve: (user: any) => user.updatedAt },
  }),
});

export { UserType };
export default { UserType };
