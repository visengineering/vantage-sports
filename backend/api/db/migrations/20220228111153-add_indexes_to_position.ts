'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.addIndex('positions', ['name', 'sportId']),
    ]);
  },

  down: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.removeIndex('positions', ['name', 'sportId']),
    ]);
  },
};
