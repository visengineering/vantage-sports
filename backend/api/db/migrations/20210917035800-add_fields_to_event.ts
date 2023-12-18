module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.addColumn('events', 'isNotificationProcessed', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }),
      queryInterface.addColumn('events', 'notificationDate', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface: any, Sequelize: any) => {},
};
