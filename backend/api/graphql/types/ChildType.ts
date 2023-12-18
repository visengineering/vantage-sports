const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = require('graphql');
import { Profile } from '../../models';
import { PositionType } from './PositionType';
import { ProfileType } from './ProfileType';
import { SportType } from './SportType';

const ChildType = new GraphQLObjectType({
  name: 'Child',
  description: 'This represents a Child model',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve: (child: any) => (child.node ? child.node.id : child.id),
    },
    parentProfileId: {
      type: GraphQLInt,
      resolve: (child: any) =>
        child.node ? child.node.parentProfileId : child.parentProfileId,
    },
    parent: {
      type: ProfileType,
      resolve: async (child: any) => {
        return await Profile.findByPk(
          parseInt(
            child.node ? child.node.parentProfileId : child.parentProfileId
          )
        );
      },
    },
    name: {
      type: GraphQLString,
      resolve: (child: any) => (child.node ? child.node.name : child.name),
    },
    favoriteSport: {
      type: SportType,
      resolve: (child: any) =>
        child.node ? child.node.getFavoriteSport() : child.getFavoriteSport(),
    },
    favoriteSportId: {
      type: GraphQLInt,
      resolve: (child: any) =>
        child.node ? child.node.favoriteSportId : child.favoriteSportId,
    },
    favoritePosition: {
      type: PositionType,
      resolve: (child: any) =>
        child.node
          ? child.node.getFavoritePosition()
          : child.getFavoritePosition(),
    },
    favoritePositionId: {
      type: GraphQLInt,
      resolve: (child: any) =>
        child.node ? child.node.favoritePositionId : child.favoritePositionId,
    },
    age: {
      type: GraphQLInt,
      resolve: (child: any) => (child.node ? child.node.age : child.age),
    },
    remarks: {
      type: GraphQLString,
      resolve: (child: any) =>
        child.node ? child.node.remarks : child.remarks,
    },
    createdAt: {
      type: GraphQLString,
      resolve: (child: any) =>
        child.node ? child.node.createdAt : child.createdAt,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (child: any) =>
        child.node ? child.node.updatedAt : child.updatedAt,
    },
  }),
});

const ChildEdgeType = new GraphQLObjectType({
  name: 'ChildEdge',
  fields: () => ({
    node: { type: ChildType, resolve: (child: any) => child },
  }),
});

const ChildConnectionType = new GraphQLObjectType({
  name: 'ChildConnection',
  fields: () => ({
    edges: { type: new GraphQLList(ChildEdgeType) },
    total: { type: GraphQLInt },
  }),
});

export { ChildType, ChildEdgeType, ChildConnectionType };

export default { ChildType, ChildEdgeType, ChildConnectionType };
