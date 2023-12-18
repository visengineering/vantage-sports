import { gql } from '@apollo/client';

export type FavoriteCoachMutation = {
  coachProfileId: number;
  playerProfileId: number;
};

export const addFavoriteCoachMutation = gql`
  mutation FavoriteCoach($coachProfileId: Int!, $playerProfileId: Int!) {
    addFavoriteCoach(
      coachProfileId: $coachProfileId
      playerProfileId: $playerProfileId
    ) {
      playerProfileId
    }
  }
`;

export const removeFavoriteCoachMutation = gql`
  mutation FavoriteCoach($coachProfileId: Int!, $playerProfileId: Int!) {
    removeFavoriteCoach(
      coachProfileId: $coachProfileId
      playerProfileId: $playerProfileId
    ) {
      playerProfileId
    }
  }
`;
