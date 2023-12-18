import { gql } from '@apollo/client';

export const childQuery = gql`
  query Child($limit: Int, $offset: Int, $parentProfileId: Int) {
    child(limit: $limit, offset: $offset, parentProfileId: $parentProfileId) {
      ... on ChildConnection {
        total
        edges {
          node {
            id
            name
            age
            remarks
            favoriteSport {
              id
              name
            }
            favoritePosition {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export const childQueryById = gql`
  query Child($id: Int) {
    child(id: $id) {
      ... on Child {
        id
        name
        age
        remarks
        parentProfileId
        favoriteSport {
          id
          name
        }
        favoritePosition {
          id
          name
        }
      }
    }
  }
`;

export const createChildMutation = gql`
  mutation createChild(
    $name: String!
    $age: Int!
    $parentProfileId: Int!
    $favoriteSportId: Int
    $favoritePositionId: Int
    $remarks: String
  ) {
    createChild(
      name: $name
      age: $age
      parentProfileId: $parentProfileId
      favoriteSportId: $favoriteSportId
      favoritePositionId: $favoritePositionId
      remarks: $remarks
    ) {
      id
    }
  }
`;

export const updateChildMutation = gql`
  mutation updateChild(
    $id: Int!
    $name: String!
    $age: Int!
    $favoriteSportId: Int
    $favoritePositionId: Int
    $remarks: String
  ) {
    updateChild(
      childId: $id
      name: $name
      age: $age
      favoriteSportId: $favoriteSportId
      favoritePositionId: $favoritePositionId
      remarks: $remarks
    ) {
      id
    }
  }
`;

export const deleteChildMutation = gql`
  mutation deleteChild($childId: Int!) {
    deleteChild(childId: $childId) {
      id
    }
  }
`;
