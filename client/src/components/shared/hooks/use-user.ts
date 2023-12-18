import jwtDecode from 'jwt-decode';
import { createContext, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { GraphQLUserProfile, MediaType } from 'src/types';
import { axiosInstance } from '../api/axios';
import { useUserProfile } from './use-user-profile';
import { useValidateJWT } from './use-validate-jwt';

export type UserContextType = null | {
  loading: boolean;
  isJwtExpired: boolean;
  userId?: number;
  profileId?: number;
  userType?: string;
  profileImage?: MediaType;
  isPhoneVerified?: boolean;
  cellphone?: string;
  error?: string;
  name?: string;
  profile?: GraphQLUserProfile;
  isAdmin?: boolean;
};

const UserContext = createContext<UserContextType>(null);
export const UserProvider = UserContext.Provider;

const extractUserId = (jwt?: string | null) => {
  if (jwt) {
    const { id: userId } = jwtDecode<{ id: number | undefined }>(jwt);
    return userId;
  }
  return undefined;
};
const extractUserProfileId = (jwt?: string | null) => {
  if (jwt) {
    const { profileId } = jwtDecode<{ profileId: number | undefined }>(jwt);
    return profileId;
  }
  return undefined;
};
const extractIsAdmin = (jwt?: string | null) => {
  if (jwt) {
    const { isAdmin } = jwtDecode<{ isAdmin: boolean | undefined }>(jwt);
    return isAdmin;
  }
  return undefined;
};

export function useUser() {
  const [{ jwt = undefined }] = useCookies<string>(['jwt']);
  const isJwtExpired = !useValidateJWT();
  const userId = extractUserId(jwt);
  const profileId = extractUserProfileId(jwt);
  const isAdmin = extractIsAdmin(jwt);
  const { loading, error, data } = useUserProfile(profileId);
  const user = useMemo<UserContextType>(() => {
    if (loading) {
      return {
        loading: true,
        isJwtExpired,
        userId,
        profileId,
        isAdmin,
      };
    }
    if (error) {
      return {
        loading: false,
        isJwtExpired,
        userId,
        profileId,
        isAdmin,
        error: error.message,
      };
    }
    const profile = data?.profile?.length ? data.profile[0] : undefined;
    if (jwt) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    }
    return {
      loading: false,
      isJwtExpired,
      userId,
      userType: profile?.userType?.toString(),
      isPhoneVerified: profile?.isPhoneVerified,
      profileImage: profile?.profileImage,
      cellphone: profile?.cellphone,
      name: profile?.name,
      profile,
      profileId,
      isAdmin,
    };
  }, [userId, loading, error, data, isJwtExpired, profileId]);
  return user;
}
