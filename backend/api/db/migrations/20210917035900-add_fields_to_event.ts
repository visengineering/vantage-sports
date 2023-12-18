module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.addColumn('events', 'isEventCancelled', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }),
      queryInterface.addColumn('events', 'eventCancelDate', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface: any, Sequelize: any) => {},
};
