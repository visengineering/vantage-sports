import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const userQueryGQL = gql`
  query userQuery {
    user {
      id
      username
      email
    }
  }
`;

const useUserQuery = () => useQuery(userQueryGQL);

export default useUserQuery;
