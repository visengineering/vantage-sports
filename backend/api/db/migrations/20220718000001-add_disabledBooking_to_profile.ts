module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    try {
      await queryInterface.addColumn('profiles', 'disabledBooking', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      });
    } catch (error) {
      console.log('Failed migration (up) script:\n\n', error, '\n\n');
      throw error;
    }
  },

  down: async (queryInterface: any, Sequelize: any) => {
    try {
      await queryInterface.removeColumn('profiles', 'disabledBooking');
    } catch (error) {
      console.log('Failed migration (down) script:\n\n', error, '\n\n');
      throw error;
    }
  },
};
