'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    var profileDesc = await queryInterface.describeTable('profiles');

    if (!profileDesc.sportId && profileDesc.sport) {
      await queryInterface.renameColumn('profiles', 'sport', 'sportId');
    }

    if (!profileDesc.universityId && profileDesc.university) {
      await queryInterface.renameColumn(
        'profiles',
        'university',
        'universityId'
      );
    }

    if (!profileDesc.positionId && profileDesc.position) {
      await queryInterface.renameColumn('profiles', 'position', 'positionId');
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
