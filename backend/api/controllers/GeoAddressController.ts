import { GeoAddressDBType } from 'api/models/GeoAddress';

type GeoAddressComponentsType = {
  streetNumber: string | undefined;
  route: string | undefined;
  area: string | undefined;
  city: string | undefined;
  region: string | undefined;
  state: string | undefined;
  postalCode: string | undefined;
  country: string | undefined;
};

type GeoAddressLatLngType = { lat: number; lng: number } | undefined;
type GeoAddressGeometryType = { location: GeoAddressLatLngType };

type GeoAddressType = {
  addressComponents: GeoAddressComponentsType | undefined;
  formattedAddress: string | undefined;
  placeId: string | undefined;
  name: string | undefined;
  geometry: GeoAddressGeometryType | undefined;
};

export const geoAddressToDBModel = (geoAddress?: GeoAddressType) => {
  if (!geoAddress) return undefined;

  const { addressComponents, formattedAddress, placeId, name, geometry } =
    geoAddress;

  const {
    streetNumber,
    route,
    area,
    city,
    region,
    state,
    postalCode,
    country,
  } = addressComponents ?? {};

  const { lat: geometryLocationLat, lng: geometryLocationLng } =
    geometry?.location ?? {};

  const geoAddressDB: GeoAddressDBType = {
    streetNumber,
    route,
    area,
    city,
    region,
    state,
    postalCode,
    country,
    formattedAddress,
    placeId,
    name,
    geometryLocationLat,
    geometryLocationLng,
  };

  return geoAddressDB;
};

export const GeoAddressController = () => {
  return {};
};

export default { GeoAddressController };
