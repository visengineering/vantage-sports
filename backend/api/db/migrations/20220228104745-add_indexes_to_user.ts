'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.addIndex('users', ['sSocialId']),
      queryInterface.addIndex('users', ['email']),
    ]);
  },

  down: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.removeIndex('users', ['sSocialId']),
      queryInterface.removeIndex('users', ['email']),
    ]);
  },
};
