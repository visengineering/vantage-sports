import { MutableRefObject, useEffect } from 'react';
import {
  GMapsApiBaseURL,
  GMapsApiKey,
  PlacesAutocompleteOptionsType,
  PlacesAutocompleteType,
  useGMaps,
} from './use-gmaps';
import {
  handleOnPlaceSelectType,
  useGMapsPlaceResult,
} from './use-gmaps-place-result';

type AutocompleteInputRefIdType =
  | {
      autocompleteInputId: string;
      autocompleteInputRef?: never;
    }
  | {
      autocompleteInputId?: never;
      autocompleteInputRef: MutableRefObject<null | {
        current?: HTMLInputElement;
      }>;
    };

type usePlaceAutocompleteType = AutocompleteInputRefIdType & {
  handleOnPlaceSelect: handleOnPlaceSelectType;
};

export const usePlaceAutocomplete = ({
  autocompleteInputId,
  autocompleteInputRef,
  handleOnPlaceSelect,
}: usePlaceAutocompleteType) => {
  const { customizeGMapsResult } = useGMapsPlaceResult();
  const { isGMapsLoaded, loadedGMapsScript, loadGMapsScript } = useGMaps();

  useEffect(() => {
    if (
      isGMapsLoaded() &&
      loadedGMapsScript({ gMapsBaseUrl: GMapsApiBaseURL })
    ) {
      initAutocomplete();
    } else initMapScript();
  }, []);

  const initMapScript = () => {
    if (GMapsApiKey) {
      loadGMapsScript({
        gMapsScriptUrl: `${GMapsApiBaseURL}?key=${GMapsApiKey}&libraries=places`,
        gMapsBaseUrl: GMapsApiBaseURL,
      }).then((res) => {
        initAutocomplete();
      });
    }
  };

  const initAutocomplete = () => {
    const inputId = document.getElementById(autocompleteInputId ?? '');
    const inputRef = autocompleteInputRef?.current;

    const isInputId = !!(inputId && inputId instanceof HTMLInputElement);
    const isInputRef = !!(inputRef && inputRef instanceof HTMLInputElement);

    const input = isInputId ? inputId : isInputRef ? inputRef : undefined;

    if (!input) return console.error('Input field must be initiated.');

    const options: PlacesAutocompleteOptionsType = {
      componentRestrictions: { country: ['US'] },
      fields: [
        'formatted_address',
        'adr_address',
        'geometry',
        'name',
        'address_component',
        'place_id',
      ],
    };
    const autocomplete = new google.maps.places.Autocomplete(input, options);

    autocomplete.addListener('place_changed', () =>
      onChangeAddress(autocomplete)
    );
  };

  const onChangeAddress = (autocomplete: PlacesAutocompleteType) => {
    const placeResult = autocomplete.getPlace();
    const customizedGMapsResult = customizeGMapsResult(placeResult);

    handleOnPlaceSelect(customizedGMapsResult);
  };
};
