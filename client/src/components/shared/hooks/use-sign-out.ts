import { useCookies } from 'react-cookie';
const { useHistory } = require('react-router-dom');

// Temporary fix for graphql error boundary
// WARNING: DO NOT IMPORT THIS!!!
export let signOut: () => void;

export const useSignOut = () => {
  const [, , removeCookie] = useCookies(['jwt']);

  const signOutFunc = () => {
    removeCookie('jwt');
    removeCookie('jwt', { path: '/' });
    removeCookie('jwt', { path: '/coach' }); // needed as for some reason it was stored long ago under this path and survived multiple refactors for some users
  };
  signOut = signOutFunc;
  return signOutFunc;
};
