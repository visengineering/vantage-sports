const {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

const TimeslotInputType = (type: string) => {
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
    case 'update':
      allGraphFields = {
        ...standardGraphFields,
        startDate: { type: GraphQLString },
        duration: { type: GraphQLInt },
        cost: { type: GraphQLInt },
        maxParticipantsCount: { type: GraphQLInt },
      };
      break;
    default:
      allGraphFields = {
        ...standardGraphFields,
      };
  }

  const timeslotInputType = new GraphQLInputObjectType({
    name: `TimeslotInputType${
      type[0].toUpperCase() + type.slice(1, type.length)
    }`,
    description: 'This represents a TimeslotInputType',
    fields: allGraphFields,
  });

  return timeslotInputType;
};
export { TimeslotInputType };
