import React, { FC } from 'react';
import { Button } from 'react-bootstrap';
import { TimePickerField } from './TimePickerField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { isMobileMediaQuery } from '../utils/responsiveness';
import { useMediaQuery } from 'react-responsive';

export const DayAvailabilityTimeRangeField: FC<{
  name: string;
  day: string;
  onClose?: () => void;
}> = ({ name, day, onClose }) => {
  const isMobile = useMediaQuery(isMobileMediaQuery);
  return (
    <div className="card day-availability-time-range">
      <div className="card-body">
        <div className="row justify-content-between align-items-end mb-3 mr-0 flex-nowrap">
          <div className="col-sm-6">
            <h5 className="card-title mb-0">{day}</h5>
          </div>
          {onClose && (
            <Button
              type="button"
              onClick={onClose}
              variant="custom"
              className="font-weight-medium crossicon"
            >
              <FontAwesomeIcon
                size="lg"
                style={{ height: '20px' }}
                icon={faTimes as any}
              />
            </Button>
          )}
        </div>
        <div className="row align-items-end">
          <div className="col-sm-6">
            <TimePickerField name={`${name}.from`} label="From*" />
          </div>
          <div className={`col-sm-6 ${isMobile ? ' mt-2' : ''}`}>
            <TimePickerField name={`${name}.to`} label="To*" />
          </div>
        </div>
      </div>
    </div>
  );
};
