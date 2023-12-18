import { rule } from 'graphql-shield';
import { AuthenticationError } from 'apollo-server-express';

const isAuthenticated = rule(
  {
    name: 'rule_is_authenticated',
    cache: 'strict',
  } as any /** TODO: name does not exist? Rule typings suggest typescript is right. */
)((parent, args, ctx) => {
  const { requireAuthentication, isAuthenticated, currentUser } = ctx;

  if (!requireAuthentication) return true;

  //This means user authentication is required
  if (!currentUser?.id || !isAuthenticated) {
    return new AuthenticationError(
      'User authentication failed. Please login again to continue'
    );
  }
  return true;
});

export { isAuthenticated };

export default {
  isAuthenticated,
};
