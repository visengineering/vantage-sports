import { GeocoderResponseType, GMapsApiKey } from './use-gmaps';
import {
  handleOnPlaceSelectType,
  useGMapsPlaceResult,
} from './use-gmaps-place-result';
import { useNotification } from '../use-notifications';
import { errorToString } from '../../api/errorToString';
import axios from 'axios';

enum GeocoderStatusConstantsEnum {
  OK = 'The response contains a valid GeocoderResponse.',
  ZERO_RESULTS = 'No result was found for this GeocoderRequest.',
  OVER_DAILY_LIMIT = 'Something went wrong. Please contact with the system.',
  OVER_QUERY_LIMIT = 'The webpage has gone over the requests limit in too short a period of time.',
  REQUEST_DENIED = 'The webpage is not allowed to use the geocoder.',
  INVALID_REQUEST = 'This GeocoderRequest was invalid.',
  ERROR = 'There was a problem contacting the Google servers.',
  UNKNOWN_ERROR = 'A geocoding request could not be processed due to a server error. The request may succeed if you try again.',
}
enum GeocoderStatusEnum {
  OK = 'OK',
  ZERO_RESULTS = 'ZERO_RESULTS',
  OVER_DAILY_LIMIT = 'OVER_DAILY_LIMIT',
  OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
  REQUEST_DENIED = 'REQUEST_DENIED',
  INVALID_REQUEST = 'INVALID_REQUEST',
  ERROR = 'ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}
type GeocoderStatusType =
  | 'OK'
  | 'ZERO_RESULTS'
  | 'OVER_DAILY_LIMIT'
  | 'OVER_QUERY_LIMIT'
  | 'REQUEST_DENIED'
  | 'INVALID_REQUEST'
  | 'ERROR'
  | 'UNKNOWN_ERROR';

type GeocodingResponseType = GeocoderResponseType & {
  plus_code: any;
  status: GeocoderStatusType;
  error_message?: any;
};

const GMapsGeocodeJson = 'https://maps.googleapis.com/maps/api/geocode/json';

type useReverseGeocodeType = { handleOnPlaceSelect: handleOnPlaceSelectType };

export const useReverseGeocode = ({
  handleOnPlaceSelect,
}: useReverseGeocodeType) => {
  const { customizeGMapsResult } = useGMapsPlaceResult();
  const notify = useNotification();

  const showGeocoderStatusError = ({
    status,
    genericErrorMsg = 'Something went wrong!!!',
  }: {
    status: GeocoderStatusType;
    genericErrorMsg?: string;
  }) => {
    notify({
      type: 'error',
      children:
        status === GeocoderStatusEnum.ZERO_RESULTS
          ? GeocoderStatusConstantsEnum.ZERO_RESULTS
          : status === GeocoderStatusEnum.OVER_DAILY_LIMIT
          ? GeocoderStatusConstantsEnum.OVER_DAILY_LIMIT
          : status === GeocoderStatusEnum.OVER_QUERY_LIMIT
          ? GeocoderStatusConstantsEnum.OVER_QUERY_LIMIT
          : status === GeocoderStatusEnum.REQUEST_DENIED
          ? GeocoderStatusConstantsEnum.REQUEST_DENIED
          : status === GeocoderStatusEnum.INVALID_REQUEST
          ? GeocoderStatusConstantsEnum.INVALID_REQUEST
          : status === GeocoderStatusEnum.ERROR
          ? GeocoderStatusConstantsEnum.ERROR
          : status === GeocoderStatusEnum.UNKNOWN_ERROR
          ? GeocoderStatusConstantsEnum.UNKNOWN_ERROR
          : genericErrorMsg,
    });
  };

  const reverseGeocode = ({ coords }: GeolocationPosition) => {
    const { latitude, longitude } = coords;
    const queryParams = {
      params: { latlng: `${latitude},${longitude}`, key: GMapsApiKey },
    };

    axios
      .get(GMapsGeocodeJson, queryParams)
      .then((response) => {
        const { results, status }: GeocodingResponseType = response.data;

        if (status === GeocoderStatusEnum.OK) {
          const placeResult = results[0];
          const customizedGMapsResult = customizeGMapsResult(placeResult);

          handleOnPlaceSelect(customizedGMapsResult);
        } else showGeocoderStatusError({ status });
      })
      .catch((error) => {
        notify({ type: 'error', children: errorToString(error) });
      });
  };

  const findMyLocation = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!navigator.geolocation) {
      notify({
        type: 'error',
        children: 'Geolocation is not supported by your browser',
      });
      return;
    }

    try {
      const position: GeolocationPosition = await new Promise(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve(position),
            (error) => reject(error)
          );
        }
      );
      reverseGeocode(position);
    } catch (error) {
      notify({ type: 'error', children: errorToString(error) });
    }
  };

  return { findMyLocation };
};
