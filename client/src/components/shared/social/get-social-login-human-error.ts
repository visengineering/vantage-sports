import { GoogleError } from './GoogleLogin';

export const getSocialLoginHumanError = (
  error: any | GoogleError,
  defaultErrorMessage: string = 'Social login failed for unknown reason.',
  type: 'sign in' | 'sign up' = 'sign in'
) => {
  if (error?.error === 'popup_closed_by_user') {
    return `Google ${type} prompt closed without successfully logging in. Please retry or use standard login.`;
  } else if (error?.error === 'access_denied') {
    return `Google ${type} prompt closed without allowing necessary access. Your security settings disallow access to your data for Vantage Sports. Please use standard login or change your security settings.`;
  } else if (error?.error === 'immediate_failed') {
    return `Google ${type} failed. You are using multiple accounts and we couldn't determine which one you would like to login with.`;
  } else if (error?.error === 'idpiframe_initialization_failed') {
    return `Google ${type} failed. Unsupported environment.${
      error.details ? JSON.stringify(error.details) : ''
    }`;
  } else {
    return error?.error ?? defaultErrorMessage;
  }
};
