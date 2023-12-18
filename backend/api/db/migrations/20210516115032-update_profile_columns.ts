'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    var profileDesc = await queryInterface.describeTable('profiles');

    if (profileDesc.ranking) {
      await queryInterface.renameColumn('profiles', 'ranking', 'rating');
    }

    if (profileDesc.class) {
      await queryInterface.removeColumn('profiles', 'class');
      await queryInterface.addColumn('profiles', 'class', {
        type: Sequelize.STRING,
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
