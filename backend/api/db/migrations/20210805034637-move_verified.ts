'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.removeColumn('users', 'verified');
    await queryInterface.addColumn('profiles', 'verified', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
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
