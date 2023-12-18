'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.addIndex('repeat_bookings', [
        'coachProfileId',
        'playerProfileId',
      ]),
    ]);
  },

  down: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.removeIndex('repeat_bookings', [
        'coachProfileId',
        'playerProfileId',
      ]),
    ]);
  },
};
