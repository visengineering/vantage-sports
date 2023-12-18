'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    if (!(await queryInterface.describeTable('participants')).rank) {
      await queryInterface.addColumn('participants', 'waiver', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      });
    }
    if (!(await queryInterface.describeTable('users')).rank) {
      await queryInterface.addColumn('users', 'rank', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.removeColumn('participants', 'waiver');
    await queryInterface.removeColumn('users', 'rank');
  },
};
