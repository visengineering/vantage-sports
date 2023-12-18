'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.removeColumn('events', 'time');
  },

  down: async (queryInterface: any, Sequelize: any) => {},
};
