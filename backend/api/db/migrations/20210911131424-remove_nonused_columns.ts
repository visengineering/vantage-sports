'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.removeColumn('users', 'username');
    await queryInterface.removeColumn('profiles', 'type');
  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.addColumn('users', 'username', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('profiles', 'type', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
