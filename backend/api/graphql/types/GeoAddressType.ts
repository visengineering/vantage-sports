import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
} from 'graphql';

const GeoAddressType = new GraphQLObjectType({
  name: 'GeoAddress',
  description: 'This represents a GeoAddress',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve: (geoAddress: any) => geoAddress.id,
    },
    streetNumber: {
      type: GraphQLString,
      resolve: (geoAddress: any) => geoAddress.streetNumber,
    },
    route: {
      type: GraphQLString,
      resolve: (geoAddress: any) => geoAddress.route,
    },
    area: {
      type: GraphQLString,
      resolve: (geoAddress: any) => geoAddress.area,
    },
    city: {
      type: GraphQLString,
      resolve: (geoAddress: any) => geoAddress.city,
    },
    region: {
      type: GraphQLString,
      resolve: (geoAddress: any) => geoAddress.region,
    },
    state: {
      type: GraphQLString,
      resolve: (geoAddress: any) => geoAddress.state,
    },
    postalCode: {
      type: GraphQLString,
      resolve: (geoAddress: any) => geoAddress.postalCode,
    },
    country: {
      type: GraphQLString,
      resolve: (geoAddress: any) => geoAddress.country,
    },
    formattedAddress: {
      type: GraphQLString,
      resolve: (geoAddress: any) => geoAddress.formattedAddress,
    },
    placeId: {
      type: GraphQLString,
      resolve: (geoAddress: any) => geoAddress.placeId,
    },
    name: {
      type: GraphQLString,
      resolve: (geoAddress: any) => geoAddress.name,
    },
    geometryLocationLat: {
      type: GraphQLFloat,
      resolve: (geoAddress: any) => geoAddress.geometryLocationLat,
    },
    geometryLocationLng: {
      type: GraphQLFloat,
      resolve: (geoAddress: any) => geoAddress.geometryLocationLng,
    },
    createdAt: {
      type: GraphQLString,
      resolve: (geoAddress: any) => geoAddress.createdAt,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (geoAddress: any) => geoAddress.updatedAt,
    },
  }),
});

export { GeoAddressType };
export default { GeoAddressType };
