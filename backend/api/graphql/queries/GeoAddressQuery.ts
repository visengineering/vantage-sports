import { GraphQLInt, GraphQLList } from 'graphql';
import { GeoAddress } from '../../models';
import { GeoAddressType } from '../types';

const geoAddressQuery = {
  type: new GraphQLList(GeoAddressType),
  args: {
    id: {
      name: 'id',
      type: GraphQLInt,
    },
  },
  resolve: async (geoAddress: any, args: any) => {
    let geoAddressData = null;
    let geoAddressesList = [];
    const geoAddressId = args.id && parseInt(args.id);

    if (geoAddressId) {
      geoAddressData = await GeoAddress.findByPk(geoAddressId);
      return geoAddressData ? [geoAddressData] : [];
    }

    geoAddressesList = await GeoAddress.findAll();
    return geoAddressesList;
  },
};

export { geoAddressQuery };
export default { geoAddressQuery };
