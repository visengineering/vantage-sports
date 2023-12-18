import { gql } from '@apollo/client';

export const allProfiles = gql`
  query Profile {
    profile {
      id
      name
      userType
      userId
      cellphone
      profileImage {
        id
        url
        publicId
      }
      user {
        id
        email
      }
      path
    }
  }
`;
