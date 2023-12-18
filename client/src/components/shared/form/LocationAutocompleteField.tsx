import React, { FC, ChangeEvent, useRef } from 'react';
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  handleOnPlaceSelectType,
  defineGeoAddressType,
} from '../hooks/googleapis/use-gmaps-place-result';
import { usePlaceAutocomplete } from '../hooks/googleapis/use-gmaps-places';
import { useReverseGeocode } from '../hooks/googleapis/use-gmaps-geocode';
import { FormInputFieldProps } from './Input';
import { Group } from './FormGroup';
import { useField } from 'formik';

type LocationAutocompleteProps = FormInputFieldProps & {
  showFindMyLocation?: boolean;
  defineGeoAddress?: defineGeoAddressType;
};

export const LocationAutocompleteField: FC<LocationAutocompleteProps> = ({
  label,
  helpText,
  containerGridArea,
  groupClassName,
  invertedLabel,
  errorOutsideGroup,
  noErrorText,
  groupChildren,
  showFindMyLocation,
  defineGeoAddress,
  ...props
}) => {
  const [{ name, value, onBlur }, { error, touched }, { setValue }] = useField(
    props.name
  );
  const autocompleteInputRef = useRef(null);

  const handleOnPlaceSelect: handleOnPlaceSelectType = (params) => {
    const { plainAddress = '' } = params ?? {};

    setValue(plainAddress);
    if (defineGeoAddress) defineGeoAddress(params);
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    if (defineGeoAddress) defineGeoAddress();
  };

  usePlaceAutocomplete({ autocompleteInputRef, handleOnPlaceSelect });
  const { findMyLocation } = useReverseGeocode({ handleOnPlaceSelect });

  const _groupChildren = !!showFindMyLocation ? (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id="find-my-location">Find my location</Tooltip>}
    >
      <button type="button" onClick={findMyLocation}>
        <i
          className="fas fa-map-marker-alt pr-1"
          style={{ color: 'darkblue' }}
        />
      </button>
    </OverlayTrigger>
  ) : undefined;

  return (
    <Group
      containerGridArea={containerGridArea}
      name={name}
      type={props.type}
      controlId={name}
      label={label}
      invertedLabel={invertedLabel}
      errorOutsideGroup={errorOutsideGroup}
      noErrorText={noErrorText}
      helpText={helpText}
      className={groupClassName}
      groupChildren={_groupChildren}
    >
      <Form.Control
        className="form-control"
        {...props}
        ref={autocompleteInputRef}
        name={name}
        value={value}
        isInvalid={Boolean(error) && touched}
        onChange={handleOnChange}
        onBlur={onBlur}
      />
    </Group>
  );
};
