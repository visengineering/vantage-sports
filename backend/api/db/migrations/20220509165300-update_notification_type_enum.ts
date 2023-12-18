'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.query(
      `ALTER TYPE "enum_notifications_type" ADD VALUE 'TS_CANCELLED' after 'EV_REVIEW';`
    );
  },

  down: async (queryInterface: any, Sequelize: any) => {},
};
