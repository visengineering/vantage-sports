import { GraphQLObjectType, GraphQLInt, GraphQLList } from 'graphql';
import { FavoriteCoach } from '../../models';
import { ProfileType } from './ProfileType';

export const FavoriteCoachType: GraphQLObjectType<
  FavoriteCoach | GraphQLObjectType<FavoriteCoach>
> = new GraphQLObjectType<FavoriteCoach | GraphQLObjectType<FavoriteCoach>>({
  name: 'FavoriteCoach',
  description: 'This represents a Favorite Coaches model',
  fields: () => ({
    playerProfileId: {
      type: GraphQLInt,
      resolve: (model: any) =>
        model.node ? model.node.playerProfileId : model.playerProfileId,
    },
    coachProfileId: {
      type: GraphQLInt,
      resolve: (model: any) =>
        model.node ? model.node.coachProfileId : model.coachProfileId,
    },
    player: {
      type: ProfileType,
      resolve: (model: any) =>
        model?.node ? model.node.getPlayerProfile() : model.getPlayerProfile(),
    },
    coach: {
      type: ProfileType,
      resolve: (model: any) =>
        model?.node ? model.node.getCoachProfile() : model.getCoachProfile(),
    },
  }),
});

export const FavoriteCoachEdgeType: GraphQLObjectType<FavoriteCoach> =
  new GraphQLObjectType<FavoriteCoach>({
    name: 'FavoriteCoachEdge',
    fields: () => ({
      node: {
        type: FavoriteCoachType,
        resolve: (timeslot: FavoriteCoach) => timeslot,
      },
    }),
  });

export const FavoriteCoachConnectionType: GraphQLObjectType<
  typeof FavoriteCoachEdgeType
> = new GraphQLObjectType<typeof FavoriteCoachEdgeType>({
  name: 'FavoriteCoachConnection',
  fields: () => ({
    edges: { type: new GraphQLList(FavoriteCoachEdgeType) },
    total: { type: GraphQLInt },
  }),
});
