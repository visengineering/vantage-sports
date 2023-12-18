'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.addColumn('users', 'profileId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    }),
      await queryInterface.addColumn('users', 'profileType', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.removeColumn('users', 'profileId'),
      await queryInterface.removeColumn('users', 'profileType');
  },
};
