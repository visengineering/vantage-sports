import { FacebookUser } from './FacebookLogin';
import { GoogleUser } from './GoogleLogin';

export const handleSocialCallback = (
  socialObjectReturned?: FacebookUser | GoogleUser
) => {
  // TODO
  // Would be cool to collect all of the logic from:
  // - "handleSocialSignup" - client/src/components/pages/SignUpIn/SignUpForm.tsx
  // - "handleSocialLogin" - client/src/components/pages/AuthenticationForm.js
  // - "handleSocialLogin" - client/src/components/pages/SignUpIn/SignInForm.js
  // to one uniform file.
};
