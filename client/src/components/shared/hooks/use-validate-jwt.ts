import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';

const isValidJWT = (jwt: string) => {
  const decodedToken = jwtDecode<{ exp: number }>(jwt);

  if (Date.now() >= decodedToken.exp * 1000) {
    return false;
  } else {
    return true;
  }
};

export const useValidateJWT = () => {
  const [{ jwt = null }] = useCookies(['jwt']);
  const [isValid, setIsValid] = useState<boolean | null>(
    jwt ? isValidJWT(jwt) : false
  );

  useEffect(() => {
    if (jwt) {
      setIsValid(isValidJWT(jwt));
    }
  }, [jwt]);

  return !!isValid;
};
