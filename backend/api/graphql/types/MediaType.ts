const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = require('graphql');

const MediaType = new GraphQLObjectType({
  name: 'Media',
  description: 'This represents a Media',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve: (media: any) => (media.node ? media.node.id : media.id),
    },
    name: {
      type: GraphQLString,
      resolve: (media: any) => (media.node ? media.node.name : media.name),
    },
    publicId: {
      type: GraphQLString,
      resolve: (media: any) =>
        media.node ? media.node.publicId : media.publicId,
    },
    url: {
      type: GraphQLString,
      resolve: (media: any) => (media.node ? media.node.url : media.url),
    },
    type: {
      type: GraphQLString,
      resolve: (media: any) => (media.node ? media.node.type : media.type),
    },
    externalId: {
      type: GraphQLInt,
      resolve: (media: any) =>
        media.node ? media.node.externalId : media.externalId,
    },
    eventId: {
      type: GraphQLInt,
      resolve: (media: any) =>
        media.node ? media.node.eventId : media.eventId,
    },
    profileId: {
      type: GraphQLInt,
      resolve: (media: any) =>
        media.node ? media.node.profileId : media.profileId,
    },
    contentId: {
      type: GraphQLInt,
      resolve: (media: any) =>
        media.node ? media.node.contentId : media.contentId,
    },
    createdAt: {
      type: GraphQLString,
      resolve: (media: any) =>
        media.node ? media.node.createdAt : media.createdAt,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (media: any) =>
        media.node ? media.node.updatedAt : media.updatedAt,
    },
  }),
});

const MediaEdgeType = new GraphQLObjectType({
  name: 'MediaEdge',
  fields: () => ({
    node: { type: MediaType, resolve: (media: any) => media },
  }),
});

const MediaConnectionType = new GraphQLObjectType({
  name: 'MediaConnection',
  fields: () => ({
    edges: { type: new GraphQLList(MediaEdgeType) },
    total: { type: GraphQLInt },
  }),
});

export { MediaType, MediaEdgeType, MediaConnectionType };
export default { MediaType, MediaEdgeType, MediaConnectionType };
