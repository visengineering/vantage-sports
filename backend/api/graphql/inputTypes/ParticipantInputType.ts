const {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
} = require('graphql');

const ParticipantInputType = (type: any) => {
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
        clientId: { type: GraphQLInt },
        coachId: { type: GraphQLInt },
        eventId: { type: GraphQLInt },
        paymentReference: { type: GraphQLString },
        paid: { type: GraphQLBoolean },
      };
      break;
    case 'update':
      allGraphFields = {
        ...standardGraphFields,
        clientId: { type: GraphQLInt },
        coachId: { type: GraphQLInt },
        eventId: { type: GraphQLInt },
        paymentReference: { type: GraphQLString },
        paid: { type: GraphQLBoolean },
      };
      break;
    default:
      allGraphFields = {
        ...standardGraphFields,
      };
  }

  const participantInputType = new GraphQLInputObjectType({
    name: `ParticipantInputType${
      type[0].toUpperCase() + type.slice(1, type.length)
    }`,
    description: 'This represents a ParticipantInputType',
    fields: allGraphFields,
  });

  return participantInputType;
};

export { ParticipantInputType };
export default { ParticipantInputType };
