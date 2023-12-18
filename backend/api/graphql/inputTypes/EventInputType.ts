const {
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

const TimeslotCreateType = new GraphQLInputObjectType({
  name: 'TimeslotCreate',
  description: 'This represents a Timeslot',
  fields: () => ({
    startDate: {
      type: GraphQLString,
    },
    endDate: {
      type: GraphQLString,
    },
    duration: {
      type: GraphQLFloat,
    },
    cost: {
      type: GraphQLFloat,
    },
    maxParticipantsCount: {
      type: GraphQLInt,
    },
  }),
});

const GeoAddressDBCreateType = new GraphQLInputObjectType({
  name: 'GeoAddressDBCreate',
  description: 'This represents GeoAddressDB',
  fields: () => ({
    streetNumber: { type: GraphQLString },
    route: { type: GraphQLString },
    area: { type: GraphQLString },
    city: { type: GraphQLString },
    region: { type: GraphQLString },
    state: { type: GraphQLString },
    postalCode: { type: GraphQLString },
    country: { type: GraphQLString },
    formattedAddress: { type: GraphQLString },
    placeId: { type: GraphQLString },
    name: { type: GraphQLString },
    geometryLocationLat: { type: GraphQLFloat },
    geometryLocationLng: { type: GraphQLFloat },
  }),
});

const EventInputType = (type: string) => {
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
      // Deprecated and should be removed soon.
      // See new: create-timeslots
      allGraphFields = {
        coachProfileId: { type: GraphQLInt },
        universityId: { type: GraphQLInt },
        sportId: { type: GraphQLInt },
        skillId: { type: GraphQLInt },
        mediaId: { type: GraphQLInt },
        positionId: { type: GraphQLInt },
        max: { type: GraphQLInt },
        duration: { type: GraphQLFloat },
        sessionType: { type: GraphQLString },
        cost: { type: GraphQLFloat },
        participantsCount: { type: GraphQLFloat },
        date: { type: GraphQLString },
        timezone: { type: GraphQLString },
        time: { type: GraphQLString },
        location: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
      };
      break;
    case 'createTimeslots':
      allGraphFields = {
        coachProfileId: { type: GraphQLInt },
        image: { type: GraphQLInt },
        title: { type: GraphQLString },
        university: { type: GraphQLInt },
        sport: { type: GraphQLInt },
        position: { type: GraphQLInt },
        skill: { type: GraphQLInt },
        locationType: { type: GraphQLString },
        location: { type: GraphQLString },
        geoAddressDB: { type: GeoAddressDBCreateType },
        eventType: { type: GraphQLString },
        timezone: { type: GraphQLString },
        timeslots: {
          type: new GraphQLNonNull(
            new GraphQLList(new GraphQLNonNull(TimeslotCreateType))
          ),
        },
        about: { type: GraphQLString },
      };
      break;
    case 'update':
      allGraphFields = {
        ...standardGraphFields,
        coachProfileId: { type: GraphQLInt },
        universityId: { type: GraphQLInt },
        sportId: { type: GraphQLInt },
        skillId: { type: GraphQLInt },
        mediaId: { type: GraphQLInt },
        positionId: { type: GraphQLInt },
        sessionType: { type: GraphQLString },
        location: { type: GraphQLString },
        geoAddressDB: { type: GeoAddressDBCreateType },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        eventType: { type: GraphQLString },
      };
      break;
    default:
      allGraphFields = {
        ...standardGraphFields,
      };
  }

  const eventInputType = new GraphQLInputObjectType({
    name: `EventInputType${type[0].toUpperCase() + type.slice(1, type.length)}`,
    description: 'This represents a EventInputType',
    fields: allGraphFields,
  });

  return eventInputType;
};
export { EventInputType };
export default { EventInputType };
