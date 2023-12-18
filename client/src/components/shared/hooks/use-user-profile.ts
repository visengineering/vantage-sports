import { useQuery } from '@apollo/client';
import { profileQuery } from 'src/components/queries/profile';
import { GraphQLUserProfile } from 'src/types';

export const useUserProfile = (profileId?: number) => {
  // Couple of things to keep in mind:
  // 1) profile is created for all types of users
  // 2) profile is the only place where we store cellphone verification status
  // 3) trainee can have sport, position and school (high school) and city like a coach
  const { loading, error, data } = useQuery<{ profile?: GraphQLUserProfile[] }>(
    profileQuery,
    {
      fetchPolicy: 'no-cache',
      variables: {
        profileId: profileId ?? undefined,
      },
      skip: !profileId,
    }
  );
  return {
    loading,
    error,
    data,
  };
};
