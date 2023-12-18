module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    if (!(await queryInterface.describeTable('profiles')).rank) {
      await queryInterface.addColumn('profiles', 'rank', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface: any, Sequelize: any) => {
    if ((await queryInterface.describeTable('profiles')).rank) {
      try {
        await queryInterface.removeColumn('profiles', 'rank');
      } catch (error) {
        console.log('Failed migration script:\n\n', error, '\n\n');
        throw error;
      }
    }
  },
};
