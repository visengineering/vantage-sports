import { gql } from '@apollo/client';

export const coachesQueryWithPagination = gql`
  query Coach(
    $offset: Int
    $limit: Int
    $sportId: Int
    $name: String
    $universityId: Int
    $onlyFavorites: Boolean
    $playerProfileId: Int
  ) {
    coach(
      offset: $offset
      limit: $limit
      sportId: $sportId
      name: $name
      universityId: $universityId
      onlyFavorites: $onlyFavorites
      playerProfileId: $playerProfileId
    ) {
      ... on CoachConnection {
        total
        edges {
          node {
            id
            name
            user {
              id
              email
            }
            sport {
              id
              name
            }
            university {
              id
              name
            }
            primaryPosition {
              id
              name
            }
            secondaryPosition {
              id
              name
            }
            skill
            skill1 {
              id
              name
              sport {
                id
                name
              }
            }
            skill2 {
              id
              name
              sport {
                id
                name
              }
            }
            skill3 {
              id
              name
              sport {
                id
                name
              }
            }
            skill4 {
              id
              name
              sport {
                id
                name
              }
            }
            rating
            class
            height
            weight
            hometown
            bio
            cellphone
            userType
            eventCount
            profileImage {
              id
              url
              publicId
            }
            bannerImage {
              id
              url
              publicId
            }
            gender
            path
            disabledBooking
          }
        }
      }
    }
  }
`;
