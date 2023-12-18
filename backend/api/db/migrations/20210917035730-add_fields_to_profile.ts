module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.addColumn('profiles', 'isPhoneVerified', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),
    ]);
  },

  down: async (queryInterface: any, Sequelize: any) => {},
};
