'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.addColumn('profiles', 'inflcr', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    });
  },

  down: async (queryInterface: any, Sequelize: any) => {},
};
