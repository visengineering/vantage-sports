'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.query(
      `ALTER TYPE "enum_notifications_type" ADD VALUE 'EV_REVIEW' after 'EV_CANCELLED';`
    );
  },

  down: async (queryInterface: any, Sequelize: any) => {},
};
