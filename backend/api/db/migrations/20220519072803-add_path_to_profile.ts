module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    try {
      await queryInterface.addColumn('profiles', 'path', {
        type: Sequelize.STRING,
      });
    } catch (error) {
      console.log('Failed migration up() script:\n\n', error, '\n\n');
      throw error;
    }
  },

  down: async (queryInterface: any, Sequelize: any) => {
    return await queryInterface.removeColumn('profiles', 'path');
  },
};
