'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.changeColumn('sports', 'name', {
      type: Sequelize.STRING,
      unique: true,
    });
  },

  down: async (queryInterface: any, Sequelize: any) => {},
};
