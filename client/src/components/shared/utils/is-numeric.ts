import _isNumber from 'lodash.isnumber';
import _isEmpty from 'lodash.isempty';
import _isNaN from 'lodash.isnan';

export const isNumeric = (value: any) => {
  return _isNumber(value) || (!_isEmpty(value) && !_isNaN(parseFloat(value)));
};
