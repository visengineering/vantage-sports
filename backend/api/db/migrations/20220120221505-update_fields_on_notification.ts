module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.renameColumn(
        'notifications',
        'delieveryStatus',
        'deliveryStatus'
      ),
      queryInterface.changeColumn('notifications', 'message', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
    ]);
  },
  down: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.renameColumn(
        'notifications',
        'deliveryStatus',
        'delieveryStatus'
      ),
      queryInterface.changeColumn('notifications', 'message', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },
};
