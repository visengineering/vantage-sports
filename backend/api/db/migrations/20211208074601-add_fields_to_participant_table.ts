'use strict';

//This migration added on Dec 8, 2021 is for improving on payment tracking for users.

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.addColumn('participants', 'paymentIntent', {
        type: Sequelize.STRING,
        unique: true,
      }),
      queryInterface.addColumn('participants', 'customer', {
        type: Sequelize.STRING,
        unique: true,
      }),
    ]);
  },
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  // },
  down: async (queryInterface: any, Sequelize: any) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
