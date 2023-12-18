'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.addIndex('events', ['profileId']),
      queryInterface.addIndex('events', ['date']),
      queryInterface.addIndex('events', ['profileId', 'date']),
    ]);
  },

  down: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.removeIndex('events', ['profileId']),
      queryInterface.removeIndex('events', ['date']),
      queryInterface.removeIndex('events', ['profileId', 'date']),
    ]);
  },
};
