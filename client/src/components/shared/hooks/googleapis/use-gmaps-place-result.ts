import {
  PlacesPlaceResultType,
  GeocoderResultType,
  GMapsResultType,
  GeocoderAddressComponentType,
  PlacesPlaceGeometryType,
  GeocoderGeometryType,
  GMapsGeometryType,
} from './use-gmaps';

// note: these commented informations are google apis naming form for the addresses
enum GMapsAddressComponentEnum {
  STREET_NUMBER = 'street_number', // [street_number]
  ROUTE = 'route', // [route]
  AREA = 'sublocality_level_1', // ['sublocality_level_1', 'sublocality', 'political']
  CITY = 'locality', // ['locality', 'political']
  REGION = 'administrative_area_level_2', // ['administrative_area_level_2', 'political']
  STATE = 'administrative_area_level_1', // ['administrative_area_level_1', 'political']
  POSTAL_CODE = 'postal_code', // ['postal_code']
  COUNTRY = 'country', // ['country', 'political']
}

// -------- Nested in GeoAddressType ----------------------------------------
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
const geoAddressComponentParams: GeoAddressComponentsType = {
  streetNumber: undefined,
  route: undefined,
  area: undefined,
  city: undefined,
  region: undefined,
  state: undefined,
  postalCode: undefined,
  country: undefined,
};

type GeoAddressLatLngType = { lat: number; lng: number } | undefined;
type GeoAddressGeometryType = { location: GeoAddressLatLngType };
// --------------------------------------------------------------------------

// -------- GeoAddressType / GeoAddressDBType -------------------------------
export type GeoAddressType = {
  addressComponents: GeoAddressComponentsType | undefined;
  formattedAddress: string | undefined;
  placeId: string | undefined;
  name: string | undefined;
  geometry: GeoAddressGeometryType | undefined;
};

export type GeoAddressDBType = {
  streetNumber: string | undefined;
  route: string | undefined;
  area: string | undefined;
  city: string | undefined;
  region: string | undefined;
  state: string | undefined;
  postalCode: string | undefined;
  country: string | undefined;
  formattedAddress: string | undefined;
  placeId: string | undefined;
  name: string | undefined;
  geometryLocationLat: number | undefined;
  geometryLocationLng: number | undefined;
};
// --------------------------------------------------------------------------

// -------- handleOnPlaceSelectType / defineGeoAddressType ------------------
type handleOnPlaceSelectParamsType = {
  geoAddress?: GeoAddressType;
  geoAddressDB?: GeoAddressDBType;
  plainAddress: string;
};
const handleOnPlaceSelectParams: handleOnPlaceSelectParamsType = {
  geoAddress: undefined,
  plainAddress: '',
};
export type handleOnPlaceSelectType = (
  handleOnPlaceSelectParams?: handleOnPlaceSelectParamsType
) => void;

export type defineGeoAddressType = handleOnPlaceSelectType;
// --------------------------------------------------------------------------

// -------- customizeGMapsResultType ----------------------------------------
type customizeGMapsResultParamsType =
  | GMapsResultType
  | PlacesPlaceResultType
  | (GeocoderResultType & { name?: string });
type customizeGmapsResultReturnType = {
  geoAddress: GeoAddressType | undefined;
  geoAddressDB: GeoAddressDBType | undefined;
  plainAddress: string;
};
type customizeGMapsResultType = (
  gMapsResult: customizeGMapsResultParamsType
) => customizeGmapsResultReturnType;
// --------------------------------------------------------------------------

// --------------------------------------------------------------------------
const customizeGMapsAddressComponents = (
  address_components?: GeocoderAddressComponentType[]
) => {
  if (!Array.isArray(address_components)) return undefined;

  const addressComponents = geoAddressComponentParams;

  address_components.forEach((component: GeocoderAddressComponentType) => {
    const types = component.types;
    const value = component.long_name;

    if (types.includes(GMapsAddressComponentEnum.STREET_NUMBER))
      addressComponents.streetNumber = value;

    if (types.includes(GMapsAddressComponentEnum.ROUTE))
      addressComponents.route = value;

    if (types.includes(GMapsAddressComponentEnum.AREA))
      addressComponents.area = value;

    if (types.includes(GMapsAddressComponentEnum.CITY))
      addressComponents.city = value;

    if (types.includes(GMapsAddressComponentEnum.REGION))
      addressComponents.region = value;

    if (types.includes(GMapsAddressComponentEnum.STATE))
      addressComponents.state = value;

    if (types.includes(GMapsAddressComponentEnum.COUNTRY))
      addressComponents.country = value;

    if (types.includes(GMapsAddressComponentEnum.POSTAL_CODE))
      addressComponents.postalCode = value;
  });

  return addressComponents;
};

const customizeGMapsGeometry = (
  geometry?: GMapsGeometryType | PlacesPlaceGeometryType | GeocoderGeometryType
) => {
  if (!geometry) return undefined;

  const { location: geometryLocation } = geometry;
  if (!geometryLocation) return undefined;

  const getLatOrLngByType = (latOrLng: number | (() => number)) => {
    return typeof latOrLng === 'function'
      ? latOrLng()
      : typeof latOrLng === 'number'
      ? latOrLng
      : undefined;
  };

  const lat = getLatOrLngByType(geometryLocation.lat);
  const lng = getLatOrLngByType(geometryLocation.lng);
  const isLatLng = lat !== undefined && lng !== undefined;

  const location = isLatLng ? { lat, lng } : undefined;

  return { location };
};

const geoAddressToDBModel = (geoAddress?: GeoAddressType) => {
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

const geoAddressToPlainAddress = (geoAddress?: GeoAddressType) => {
  if (!geoAddress) return '';

  const { addressComponents, formattedAddress, name } = geoAddress;
  const { streetNumber, route, area, city, region, state, postalCode } =
    addressComponents ?? {};

  const stringWithComa = (str?: string) => {
    return !!str ? str + ', ' : '';
  };

  const plainAddress =
    formattedAddress ||
    name ||
    stringWithComa(streetNumber) +
      stringWithComa(route) +
      stringWithComa(area) +
      stringWithComa(city) +
      stringWithComa(region) +
      stringWithComa(state) +
      postalCode;

  return plainAddress;
};
// --------------------------------------------------------------------------

export const useGMapsPlaceResult = () => {
  const gMapsResultToGeoAddress = (
    gMapsResult: customizeGMapsResultParamsType
  ) => {
    const { address_components, formatted_address, place_id, name, geometry } =
      gMapsResult;

    const addressComponents =
      customizeGMapsAddressComponents(address_components);
    const geoAddressGeometry = customizeGMapsGeometry(geometry);

    if (
      !addressComponents &&
      !formatted_address &&
      !place_id &&
      !name &&
      !geoAddressGeometry
    ) {
      return undefined;
    }

    const geoAddress: GeoAddressType = {
      addressComponents,
      formattedAddress: formatted_address,
      placeId: place_id,
      name,
      geometry: geoAddressGeometry,
    };

    return geoAddress;
  };

  const customizeGMapsResult: customizeGMapsResultType = (gMapsResult) => {
    const geoAddress = gMapsResultToGeoAddress(gMapsResult);

    const geoAddressDB = geoAddressToDBModel(geoAddress);

    const plainAddress = geoAddressToPlainAddress(geoAddress);

    return { geoAddress, geoAddressDB, plainAddress };
  };

  return { gMapsResultToGeoAddress, customizeGMapsResult };
};
