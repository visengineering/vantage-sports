import { UserTypeEnum } from '../../models/User';
import { QueryInterface, Sequelize } from 'sequelize/types';
import { Profile, User } from '../../models';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    try {
      const profilesWithoutUserType = await Profile.findAll({
        where: { userType: null },
      });
      profilesWithoutUserType.forEach((p) => {
        if (!p.userType) {
          console.log('Updating profile with id = ', p.id);
          p.userType = UserTypeEnum.TRAINEE;
          p.save();
        }
      });
      const usersWithoutUserType = await User.findAll({
        where: { userType: null },
      });
      usersWithoutUserType.forEach((u) => {
        if (!u.userType) {
          console.log('Updating user with id = ', u.id);
          u.userType = UserTypeEnum.TRAINEE;
          u.save();
        }
      });
    } catch (error) {
      console.log('Failed migration (up) script:\n\n', error, '\n\n');
      throw error;
    }
  },

  down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {},
};
