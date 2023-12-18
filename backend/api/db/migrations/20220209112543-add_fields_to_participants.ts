module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.addColumn('participants', 'reviewId', {
        type: Sequelize.INTEGER,
        unique: true,
        references: { model: { tableName: 'reviews' }, key: 'id' },
      }),
      queryInterface.addColumn('participants', 'toast_notification_sent', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),
      queryInterface.addColumn('participants', 'email_notification_sent', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),
    ]);
  },

  down: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.removeColumn('participants', 'reviewId'),
      queryInterface.removeColumn('participants', 'toast_notification_sent'),
      queryInterface.removeColumn('participants', 'email_notification_sent'),
    ]);
  },
};
