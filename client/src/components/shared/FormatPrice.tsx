import React, { FC } from 'react';

type Currency = 'USD' | 'EUR'; // Currently we only support USD
type FormatPrice = {
  price: number;
  currency?: 'USD';
};

const getCurrencySign = (currency: Currency) => {
  switch (currency) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    default:
      return '$';
  }
};

export const FormatPrice: FC<FormatPrice> = ({ price, currency = 'USD' }) => (
  <>
    {getCurrencySign(currency)}
    {price}
  </>
);
