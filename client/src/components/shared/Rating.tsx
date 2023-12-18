import React, { FC, CSSProperties } from 'react';
import * as assets from '../../assets';

type RatingProps = {
  value: number;
  maxValue: number;
  ratingsStyles?: CSSProperties;
};

export const Rating: FC<RatingProps> = ({
  value,
  maxValue,
  ratingsStyles = {},
}) => {
  let isHalf = Math.round(value) < value;
  let nullStars = isHalf
    ? maxValue - Math.round(value) - 1
    : maxValue - Math.round(value);

  return (
    <ul
      className="rating"
      style={{
        listStyleType: 'none',
        display: 'flex',
        padding: 0,
        justifyContent: 'center',
        ...ratingsStyles,
      }}
    >
      {[...Array(Math.round(value))].map(function mapOverFullStars(e, idx) {
        return (
          <li key={idx}>
            <span>
              <img
                src={assets.star}
                alt="star"
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
            </span>
          </li>
        );
      })}

      {isHalf && (
        <li>
          <span>
            <img
              src={assets.starHalf}
              alt="half-star"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </span>
        </li>
      )}

      {[...Array(nullStars)].map(function mapOverNullStarCount(e, idx) {
        return (
          <li key={idx}>
            <span>
              <img
                src={assets.starNull}
                alt="null-star"
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
            </span>
          </li>
        );
      })}

      {value > 0 && (
        <li style={{ marginLeft: '10px' }}>
          <span>{value}</span>
        </li>
      )}
    </ul>
  );
};

export default Rating;
