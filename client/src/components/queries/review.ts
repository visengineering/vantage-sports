import { gql } from '@apollo/client';

export const reviewQuery = gql`
  query Review($coachId: Int) {
    review(coachProfileId: $coachId) {
      comment
      rating
      player {
        name
        profileImage {
          id
          publicId
          url
        }
      }
    }
  }
`;
