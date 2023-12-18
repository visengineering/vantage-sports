import authService from '../../api/services/auth.service';
import { User } from '../../api/models';

const getAccessToken = async (id: number) => {
  if (id) {
    return authService().issue({
      id,
      isAdmin: false,
      profileId: id,
    });
  }

  const user = await User.create({
    email: `${Math.random()}testmail@testmail.com`,
    password: 'supersecurepassword',
  });

  const profile = await user.getProfile();
  const token = authService().issue({
    id: user.id,
    isAdmin: !!user.admin,
    profileId: profile.id,
  });

  return token;
};

export { getAccessToken };
