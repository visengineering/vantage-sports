import { QueryInterface, Sequelize } from 'sequelize/types';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    return queryInterface.sequelize.query(
      `ALTER TYPE "enum_notifications_type" ADD VALUE 'EV_UPDATED_LOCATION' after 'WELCOME_USER';`
    );
  },
  down: async (queryInterface: any, Sequelize: any) => {},
};
