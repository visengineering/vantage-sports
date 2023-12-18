import { QueryInterface, Sequelize } from 'sequelize/types';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    try {
      await queryInterface.changeColumn('events', 'description', {
        type: Sequelize.STRING(450),
      });
    } catch (error) {
      console.log('Failed migration (up) script:\n\n', error, '\n\n');
      throw error;
    }
  },

  down: async (queryInterface: any, Sequelize: any) => {
    try {
      await queryInterface.changeColumn('events', 'description', {
        type: Sequelize.STRING(255),
      });
    } catch (error) {
      console.log('Failed migration (down) script:\n\n', error, '\n\n');
      throw error;
    }
  },
};
