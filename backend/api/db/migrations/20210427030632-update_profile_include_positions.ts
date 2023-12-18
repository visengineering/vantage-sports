'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    var profileDesc = await queryInterface.describeTable('profiles');

    if (profileDesc.positionId) {
      await queryInterface.renameColumn(
        'profiles',
        'positionId',
        'primaryPositionId'
      );
    }

    if (!profileDesc.secondaryPositionId) {
      await queryInterface.addColumn('profiles', 'secondaryPositionId', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
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
