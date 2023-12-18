const {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

const MediaInputType = (type: any) => {
  let allGraphFields = {};
  const standardGraphFields = {
    id: { type: new GraphQLNonNull(GraphQLInt) },
  };

  switch (type) {
    case 'delete':
      allGraphFields = {
        ...standardGraphFields,
      };
      break;
    case 'create':
      allGraphFields = {
        name: { type: GraphQLString },
        url: { type: GraphQLString },
        type: { type: GraphQLString },
        publicId: { type: GraphQLString },
        externalId: { type: GraphQLString },
        eventId: { type: GraphQLInt },
        profileId: { type: GraphQLInt },
        contentId: { type: GraphQLInt },
      };
      break;
    case 'update':
      allGraphFields = {
        ...standardGraphFields,
        name: { type: GraphQLString },
        url: { type: GraphQLString },
        type: { type: GraphQLString },
        externalId: { type: GraphQLString },
        publicId: { type: GraphQLString },
        eventId: { type: GraphQLInt },
        profileId: { type: GraphQLInt },
        contentId: { type: GraphQLInt },
      };
      break;
    default:
      allGraphFields = {
        ...standardGraphFields,
      };
  }

  const mediaInputType = new GraphQLInputObjectType({
    name: `MediaInputType${type[0].toUpperCase() + type.slice(1, type.length)}`,
    description: 'This represents a MediaInputType',
    fields: allGraphFields,
  });

  return mediaInputType;
};

export { MediaInputType };
export default { MediaInputType };
