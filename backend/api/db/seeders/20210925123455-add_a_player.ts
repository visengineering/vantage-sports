import { User } from '../../models';
import { UserTypeEnum } from '../../models/User';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    try {
      let user = await User.create({
        password: 'player',
        userType: UserTypeEnum.TRAINEE,
        email: 'player@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await user.createProfile({
        name: 'Jack The Player',
        sportId: 2,
        userType: UserTypeEnum.TRAINEE,
        universityId: 2,
        city: 'Boston',
        state: 'Massachusetts',
        zip: '06613',
        primaryPositionId: 4,
        secondaryPositionId: 5,
        skill: 'shooting',
        disabledBooking: false,
      });
    } catch (error) {
      console.log('Failed seed script:\n\n', error, '\n\n');
      throw error;
    }
  },

  down: async (queryInterface: any, Sequelize: any) => {},
};
