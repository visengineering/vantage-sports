'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    if (!(await queryInterface.describeTable('profiles')).name) {
      await queryInterface.addColumn('profiles', 'name', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface: any, Sequelize: any) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
