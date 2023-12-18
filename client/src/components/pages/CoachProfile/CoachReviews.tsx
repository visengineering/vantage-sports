import { Review } from '../../shared/ReviewCard';
import React, { FC } from 'react';
import { GraphQLUserProfile } from 'src/types';
type ReviewsArray = {
  comment: string;
  rating: number;
  player: GraphQLUserProfile;
};
export const CoachReviews: FC<{
  reviewsArray: ReviewsArray[];
}> = ({ reviewsArray }) => (
  <div className="review-card-container">
    <div className="row">
      {reviewsArray.map(({ comment, rating, player }) => (
        <div className="col-lg-4 col-sm-6" key={comment}>
          <Review
            comment={comment}
            rating={rating}
            reviewerName={player.name}
            reviewerPicture={player.profileImage?.url}
          />
        </div>
      ))}
    </div>
  </div>
);
