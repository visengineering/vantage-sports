import { QueryInterface, Sequelize } from 'sequelize/types';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    try {
      await queryInterface.removeConstraint(
        'participants',
        'participants_customer_key'
      );
    } catch (error) {
      console.log('Failed migration (up) script:\n\n', error, '\n\n');
      throw error;
    }
  },

  down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    try {
      await queryInterface.addConstraint('participants', {
        fields: ['customer'],
        type: 'unique',
        name: 'participants_customer_key',
      });
    } catch (error) {
      console.log('Failed migration (down) script:\n\n', error, '\n\n');
      throw error;
    }
  },
};
