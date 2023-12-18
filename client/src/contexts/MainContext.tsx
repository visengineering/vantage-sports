import React, { ReactNode, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { useSignOut } from 'src/components/shared/hooks/use-sign-out';
import { useUser } from 'src/components/shared/hooks/use-user';
import { GraphQLUserProfile, MainContextType, UserTypeEnum } from 'src/types';

const MainContext = React.createContext<MainContextType>(
  undefined as unknown as MainContextType /* TODO: requires improvement */
);

const COOKIE_EXPIRATION_TIME =
  parseInt(process.env.REACT_APP_SESSION_EXPIRY_SECONDS ?? '10800') || 10800; // default 3h

function MainContextProvider({ children }: { children: ReactNode }) {
  const user = useUser();
  const [cookies, setCookie] = useCookies(['jwt']);
  const [invite, setInvite] = useState(
    queryString.parse(window.location.search).invite
  );
  const [live, setLive] = useState(true);
  const [jwt, setJwt] = useState(cookies['jwt']);
  const [isSignedIn, setIsSignedIn] = useState(!!cookies['jwt']);
  const [userName, setUserName] = useState(user?.name);
  const [userId, setUserId] = useState(user?.userId);
  const [profileId, setProfileId] = useState(user?.profileId);
  const [coachId, setCoachId] = useState(user?.profileId);
  const [userType, setUserType] = useState(user?.userType);
  const [isPhoneVerified, setIsPhoneVerified] = useState(user?.isPhoneVerified);
  const [profile, setProfile] = useState<GraphQLUserProfile | undefined>(
    user?.profile
  );
  const history = useHistory();
  const [admin, setAdmin] = useState(user?.isAdmin ?? false);
  const [isSocialSignup, setIsSocialSignup] = useState(false);
  const [socialToken, setSocialToken] = useState('');
  const [socialType] = useState('');
  const [showEventCancel, setShowEventCancel] = useState(false);
  const signOut = useSignOut();
  const logout = (args?: { isExpiredJwt?: boolean }) => {
    setJwt(undefined);
    signOut();
    if (args?.isExpiredJwt) {
      window.location.href = `${
        window.location.protocol + '//' + window.location.host
      }/signin?expired=true`;
      if (history) {
        history.push({
          pathname: '/signin',
          search: '?expired=true',
        });
      }
    } else {
      window.location.href = `${
        window.location.protocol + '//' + window.location.host
      }/sports-coaching`;
      if (history) {
        history.push({
          pathname: '/sports-coaching',
        });
      }
    }
  };
  const login = (args: { jwt: string }) => {
    setJwt(args.jwt);
    setCookie('jwt', args.jwt, { maxAge: COOKIE_EXPIRATION_TIME });
  };

  useEffect(() => {
    if (isSignedIn && user && user.isJwtExpired) {
      logout({ isExpiredJwt: true });
      setJwt(null);
      setIsSignedIn(false);
    }
    if (user && !user.isJwtExpired) {
      setJwt(jwt);
      setIsSignedIn(true);
    }
    if (user && user.name) {
      setUserName(user.name);
    }
    if (user && user.userId) {
      setUserId(user.userId);
    }
    if (user && user.profileId) {
      setProfileId(user.profileId);
      if (user && user.userType && user.userType === UserTypeEnum.COACH) {
        setCoachId(user.profileId);
      } else {
        setCoachId(undefined);
      }
    } else {
      setProfileId(undefined);
      setCoachId(undefined);
    }
    if (user && user.userType) {
      setUserType(user.userType);
    }
    if (user && user.profile) {
      setProfile(user.profile);
    }
    if (user && user.name) {
      setUserName(user.name);
    }
    if (user && user.isAdmin) {
      setAdmin(user.isAdmin);
    } else {
      setAdmin(false);
    }
    if (user && user.isPhoneVerified) {
      setIsPhoneVerified(user.isPhoneVerified);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, jwt]);

  function detectBrowser() {
    if (
      (navigator.userAgent.indexOf('Opera') ||
        navigator.userAgent.indexOf('OPR')) != -1
    ) {
      return 'Opera';
    } else if (navigator.userAgent.indexOf('Chrome') != -1) {
      return 'Chrome';
    } else if (navigator.userAgent.indexOf('Safari') != -1) {
      return 'Safari';
    } else if (navigator.userAgent.indexOf('Firefox') != -1) {
      return 'Firefox';
    } else if (
      navigator.userAgent.indexOf('MSIE') != -1 ||
      !!(document as unknown as { documentMode: boolean }).documentMode == true
    ) {
      return 'IE';
    } else {
      return 'Unknown';
    }
  }

  const getLoginStatus = () => {
    return !!jwt;
  };

  function signedIn() {
    return getLoginStatus();
  }

  function checkIsCoach() {
    return getLoginStatus() && userType?.toString() === '1';
  }

  function player() {
    return getLoginStatus() && userType?.toString() === '2';
  }

  return (
    <MainContext.Provider
      value={{
        loading: !!user?.loading || (signedIn() && !profileId && !user?.error),
        invite,
        live,
        setLive,
        setInvite,
        jwt,
        profileId,
        profile,
        setProfile,
        userId,
        setUserId,
        admin,
        userType,
        setUserType,
        isSignedIn,
        coachId,
        setCoachId,
        player,
        isCoach: checkIsCoach(),
        signedIn,
        userName,
        setUserName,
        isSocialSignup,
        setIsSocialSignup,
        socialToken,
        setSocialToken,
        socialType,
        isPhoneVerified,
        setIsPhoneVerified,
        showEventCancel,
        setShowEventCancel,
        detectBrowser,
        logout,
        login,
      }}
    >
      {children}
    </MainContext.Provider>
  );
}

export { MainContextProvider, MainContext };
