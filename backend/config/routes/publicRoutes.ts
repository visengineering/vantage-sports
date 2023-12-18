export const publicRoutes = {
  'POST /login': 'AuthController.login',
  'POST /admin/login-as': 'AdminController.loginAs',
  'POST /admin/reschedule-training': 'AdminController.rescheduleTraining',
  'POST /admin/change-user-type': 'AdminController.changeUserType',
  'POST /admin/delete-user': 'AdminController.deleteUser',
  'POST /validate': 'AuthController.validate',
  'POST /change-password': 'AuthController.passwordChange',
  'POST /validate-reset': 'AuthController.validateResetRequest',
  'POST /password-reset/': 'AuthController.passwordResetRequest',
  'GET /lookups/referrers': 'ReferralSourceController.getAll',
  'GET /lookups/sports': 'SportController.getAll',
  'GET /lookups/positions': 'PositionController.getAll',
  'GET /lookups/skills': 'SkillController.getAll',
  'GET /lookups/universities': 'UniversityController.getAll',
  'GET /lookups/states': 'StateController.getAll',
  'POST /signup-started': 'SignupStartedController.signupStarted',
  'POST /signup': 'SignupController.signup',
  'POST /create-checkout-session': 'CheckoutController.createSession',
  'POST /checkout-success': 'CheckoutController.purchaseComplete',
  'POST /social-login': 'AuthController.socialLogin',
  'POST /social-signup': 'SignupController.socialSignup',

  /**************Event System Routes ****************/
  'POST /check-phone-number-validation':
    'AuthController.checkPhoneNumberValidation',
  'POST /send-verification-code': 'AuthController.sendVerificationCode',
  'POST /check-verification-code': 'AuthController.checkVerificationCode',
  /********************************* ****************/
};

export default publicRoutes;
