'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.addIndex('reviews', ['coachProfileId']),
      queryInterface.addIndex('reviews', [
        'coachProfileId',
        'playerProfileId',
        'eventId',
      ]),
    ]);
  },

  down: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.removeIndex('reviews', ['coachProfileId']),
      queryInterface.removeIndex('reviews', [
        'coachProfileId',
        'playerProfileId',
        'eventId',
      ]),
    ]);
  },
};
