'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([queryInterface.addIndex('sports', ['name'])]);
  },

  down: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([queryInterface.removeIndex('sports', ['name'])]);
  },
};
