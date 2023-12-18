const {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
} = require('graphql');

const CoachInputType = (type: any) => {
  let allGraphFields = {};
  const standardGraphFields = {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
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
        email: { type: GraphQLString },
        cellphone: { type: GraphQLString },
        name: { type: GraphQLString },
        sportId: { type: GraphQLInt },
        universityId: { type: GraphQLInt },
        city: { type: GraphQLString },
        state: { type: GraphQLString },
        zip: { type: GraphQLString },
        primaryPositionId: { type: GraphQLInt },
        secondaryPositionId: { type: GraphQLInt },
        skill: { type: GraphQLString },
        skill1Id: { type: GraphQLInt },
        skill2Id: { type: GraphQLInt },
        skill3Id: { type: GraphQLInt },
        skill4Id: { type: GraphQLInt },
        bio: { type: GraphQLString },
        hometown: { type: GraphQLString },
        gender: { type: GraphQLString },
        rating: { type: GraphQLString },
        class: { type: GraphQLString },
        height: { type: GraphQLString },
        weight: { type: GraphQLString },
        profileImage: { type: GraphQLInt },
        bannerImage: { type: GraphQLInt },
        disabledBooking: { type: GraphQLBoolean },
      };
      break;
    default:
      allGraphFields = {
        ...standardGraphFields,
      };
  }

  const coachInputType = new GraphQLInputObjectType({
    name: `CoachInputType${type[0].toUpperCase() + type.slice(1, type.length)}`,
    description: 'This represents a CoachInputType',
    fields: allGraphFields,
  });

  return coachInputType;
};

export { CoachInputType };
export default CoachInputType;
