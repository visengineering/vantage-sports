import { gql } from '@apollo/client';

export const profileQuery = gql`
  query Profile($profileId: Int) {
    profile(id: $profileId) {
      ... on Profile {
        id
        user {
          id
          email
        }
        name
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
        isPhoneVerified
        hometown
        bio
        cellphone
        userType
        profileImage {
          id
          publicId
          url
        }
        bannerImage {
          id
          publicId
          url
        }
        gender
        path
        disabledBooking
      }
    }
  }
`;

export const editProfileMutation = gql`
  mutation updateCoach($coach: CoachInputTypeUpdate!) {
    updateCoach(coach: $coach) {
      id
      name
      path
    }
  }
`;
