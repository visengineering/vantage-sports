'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.addColumn('participants', 'timezone', {
        type: Sequelize.STRING,
        defaultValue: 'America/New_York',
        allowNull: false,
      }),
      queryInterface.addColumn('events', 'timezone', {
        type: Sequelize.STRING,
        defaultValue: 'America/New_York',
        allowNull: false,
      }),
    ]);
  },

  down: async (queryInterface: any, Sequelize: any) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
