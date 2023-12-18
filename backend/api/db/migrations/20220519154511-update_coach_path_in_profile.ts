import { UserTypeEnum } from '../../models/User';
import { Profile } from '../../models';
import { getProfilePathUsingName } from '../../helpers/common';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    try {
      // Not needed anymore for fresh installs. Commented out as it causes issue
      // ERROR: column "geoAddressId" does not exist
      // const coaches = await Profile.findAll({
      //   where: {
      //     userType: UserTypeEnum.COACH,
      //   },
      // });
      // for (let coach of coaches) {
      //   const path = await getProfilePathUsingName(coach.name, coach.id);
      //   await coach.update({
      //     path,
      //   });
      // }
    } catch (error) {
      console.log('Failed migration up() script:\n\n', error, '\n\n');
      throw error;
    }
  },

  down: async (queryInterface: any, Sequelize: any) => {
    try {
      const coaches = await Profile.findAll({
        where: {
          userType: UserTypeEnum.COACH,
        },
      });

      for (let coach of coaches) {
        await coach.update({
          path: '',
        });
      }
    } catch (error) {
      console.log('Failed migration down() script:\n\n', error, '\n\n');
      throw error;
    }
  },
};
