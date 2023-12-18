const {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

const ReviewInputType = (type: any) => {
  let allGraphFields = {};
  const standardGraphFields = {
    id: { type: new GraphQLNonNull(GraphQLInt) },
  };

  switch (type) {
    case 'create':
      allGraphFields = {
        coachProfileId: { type: GraphQLInt },
        playerProfileId: { type: GraphQLInt },
        participantId: { type: GraphQLInt },
        eventId: { type: GraphQLInt },
        comment: { type: GraphQLString },
        rating: { type: GraphQLInt },
      };
      break;
    case 'update':
      allGraphFields = {
        id: { type: GraphQLInt },
        comment: { type: GraphQLString },
        rating: { type: GraphQLInt },
      };
      break;
    default:
      allGraphFields = {
        ...standardGraphFields,
      };
  }

  const reviewInputType = new GraphQLInputObjectType({
    name: `ReviewInputType${
      type[0].toUpperCase() + type.slice(1, type.length)
    }`,
    description: 'This represents a ReviewInputType',
    fields: allGraphFields,
  });

  return reviewInputType;
};

export { ReviewInputType };
export default { ReviewInputType };
