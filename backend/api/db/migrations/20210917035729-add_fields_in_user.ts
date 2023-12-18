module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    try {
      await queryInterface.addColumn('users', 'sSocialId', {
        type: Sequelize.STRING,
        allowNull: true,
      });
      await queryInterface.addColumn('users', 'sSocialToken', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
      await queryInterface.addColumn('users', 'sSocialType', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    } catch (error) {
      console.log('Failed migration script:\n\n', error, '\n\n');
      throw error;
    }
  },

  down: async (queryInterface: any, Sequelize: any) => {
    try {
      if ((await queryInterface.describeTable('users')).sSocialId) {
        await queryInterface.removeColumn('users', 'sSocialId');
      }
      if ((await queryInterface.describeTable('users')).sSocialToken) {
        await queryInterface.removeColumn('users', 'sSocialToken');
      }
      if ((await queryInterface.describeTable('users')).sSocialType) {
        await queryInterface.removeColumn('users', 'sSocialType');
      }
    } catch (error) {
      console.log('Failed migration script:\n\n', error, '\n\n');
      throw error;
    }
    return;
  },
};
