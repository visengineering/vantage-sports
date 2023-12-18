import React from 'react';
import { QuoteSVG } from 'src/assets/Quote';
import { Rating } from 'src/components/shared';
import * as assets from '../../assets';

type Props = {
  comment: string;
  rating: number;
  reviewerName: string;
  reviewerPicture?: string;
};
export const Review = ({
  comment,
  rating,
  reviewerName,
  reviewerPicture,
}: Props) => {
  return (
    <div className="card">
      <div className="card-img">
        <div className="img-container">
          {reviewerPicture ? (
            <img src={reviewerPicture} alt="imageC" />
          ) : (
            <img src={assets.defaultPic} alt="imageC" />
          )}

          <span className="quote-icon">
            <QuoteSVG />
          </span>
        </div>
      </div>

      <h4 className="name">{reviewerName}</h4>

      <ul className="rating">
        <Rating value={rating || 0} maxValue={5} />
      </ul>

      <div className="review-text">{comment}</div>
    </div>
  );
};
