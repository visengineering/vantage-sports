export type GMapsPlaceType = google.maps.Place;
export type PlacesAutocompleteType = google.maps.places.Autocomplete;
export type PlacesAutocompleteOptionsType =
  google.maps.places.AutocompleteOptions;

export type GeocoderResponseType = google.maps.GeocoderResponse;

// -------- Nested in GeometryType ------------------------------------------
type LatLngLiteralType = google.maps.LatLngLiteral;
type LatLngBoundsType = google.maps.LatLngBounds;
type LatLngType = google.maps.LatLng;
type GeocoderLocationTypeType =
  | 'APPROXIMATE'
  | 'GEOMETRIC_CENTER'
  | 'RANGE_INTERPOLATED'
  | 'ROOFTOP';
enum GeocoderLocationTypeEnum {
  APPROXIMATE = 'APPROXIMATE',
  GEOMETRIC_CENTER = 'GEOMETRIC_CENTER',
  RANGE_INTERPOLATED = 'RANGE_INTERPOLATED',
  ROOFTOP = 'ROOFTOP',
}
// --------------------------------------------------------------------------

// -------- Nested in ResultType --------------------------------------------
export type PlacesPlaceGeometryType = google.maps.places.PlaceGeometry;
export type GeocoderGeometryType = google.maps.GeocoderGeometry;
export type GMapsGeometryType = {
  location_type?: GeocoderLocationTypeType;
  location?: LatLngType | LatLngLiteralType;
  viewport?: LatLngBoundsType;
  bounds?: LatLngBoundsType;
};

export type GeocoderAddressComponentType = google.maps.GeocoderAddressComponent;

type PlacesPlaceOpeningHoursType = google.maps.places.PlaceOpeningHours;
type PlacesPlaceAspectRatingType = google.maps.places.PlaceAspectRating;
type PlacesBusinessStatusType = google.maps.places.BusinessStatus;
type PlacesPlacePlusCodeType = google.maps.places.PlacePlusCode;
type PlacesPlaceReviewType = google.maps.places.PlaceReview;
type PlacesPlacePhotoType = google.maps.places.PlacePhoto;
// --------------------------------------------------------------------------

// --------------------------------------------------------------------------
export type PlacesPlaceResultType =
  | google.maps.places.PlaceResult
  | {
      address_components?: GeocoderAddressComponentType[];
      adr_address?: string;
      aspects?: PlacesPlaceAspectRatingType[];
      business_status?: PlacesBusinessStatusType;
      formatted_address?: string;
      formatted_phone_number?: string;
      geometry?: PlacesPlaceGeometryType;
      html_attributions?: string[];
      icon?: string;
      icon_background_color?: string;
      icon_mask_base_uri?: string;
      international_phone_number?: string;
      name?: string;
      opening_hours?: PlacesPlaceOpeningHoursType;
      permanently_closed?: boolean;
      photos?: PlacesPlacePhotoType[];
      place_id?: string;
      plus_code?: PlacesPlacePlusCodeType;
      price_level?: number;
      rating?: number;
      reviews?: PlacesPlaceReviewType[];
      types?: string[];
      url?: string;
      user_ratings_total?: number;
      utc_offset?: number;
      utc_offset_minutes?: number;
      vicinity?: string;
      website?: string;
    };
export type GeocoderResultType =
  | google.maps.GeocoderResult
  | {
      address_components: GeocoderAddressComponentType[];
      formatted_address: string;
      geometry: GeocoderGeometryType;
      partial_match?: boolean;
      place_id: string;
      plus_code?: PlacesPlacePlusCodeType;
      postcode_localities?: string[];
      types: string[];
    };
export type GMapsResultType = {
  address_components?: GeocoderAddressComponentType[]; // address_components
  formatted_address?: string; // formatted_address
  place_id?: string; // place_id
  plus_code?: PlacesPlacePlusCodeType;
  types?: string[]; // types
  geometry?: GMapsGeometryType;
  // geometry?: PlacesPlaceGeometryType | GeocoderGeometryType; // geometry

  name?: string;
  adr_address?: string;

  aspects?: PlacesPlaceAspectRatingType[];
  business_status?: PlacesBusinessStatusType;
  formatted_phone_number?: string;
  html_attributions?: string[];
  icon?: string;
  icon_background_color?: string;
  icon_mask_base_uri?: string;
  international_phone_number?: string;
  opening_hours?: PlacesPlaceOpeningHoursType;
  permanently_closed?: boolean;
  photos?: PlacesPlacePhotoType[];
  price_level?: number;
  rating?: number;
  reviews?: PlacesPlaceReviewType[];
  url?: string;
  user_ratings_total?: number;
  utc_offset?: number;
  utc_offset_minutes?: number;
  vicinity?: string;
  website?: string;

  partial_match?: boolean;
  postcode_localities?: string[];
};
// --------------------------------------------------------------------------

export const GMapsApiBaseURL = 'https://maps.googleapis.com/maps/api/js';
export const GMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export const useGMaps = () => {
  const isGMapsLoaded = () => {
    if (typeof google !== 'undefined' && !!google.maps) return true;
    return false;
  };

  const loadedGMapsScript = ({ gMapsBaseUrl }: { gMapsBaseUrl: string }) => {
    const scriptElements = document.querySelectorAll(
      `script[src*="${gMapsBaseUrl}"]`
    );

    if (typeof scriptElements !== 'undefined' && scriptElements.length > 0)
      return scriptElements[0] as HTMLScriptElement;

    return undefined;
  };

  const loadGMapsScript = ({
    gMapsBaseUrl,
    gMapsScriptUrl,
  }: {
    gMapsBaseUrl: string;
    gMapsScriptUrl: string;
  }) => {
    return new Promise((resolve) => {
      const scriptElement = loadedGMapsScript({ gMapsBaseUrl });

      if (scriptElement !== undefined) {
        // in case we already have a script on the page and it's loaded we resolve
        if (isGMapsLoaded()) return resolve(scriptElement);

        // otherwise we wait until it's loaded and resolve
        scriptElement.addEventListener('load', () => resolve(scriptElement));
      }

      const newScriptElement = document.createElement('script');
      const source = {
        src: gMapsScriptUrl,
        type: 'text/javascript',
        async: true,
      };
      Object.assign(newScriptElement, source);
      newScriptElement.addEventListener('load', () =>
        resolve(newScriptElement)
      );
      document.head.appendChild(newScriptElement);
    });
  };

  return { isGMapsLoaded, loadedGMapsScript, loadGMapsScript };
};
