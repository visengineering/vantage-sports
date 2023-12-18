module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable('repeat_bookings', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      coachProfileId: {
        type: Sequelize.INTEGER,
        unique: false,
        references: { model: { tableName: 'profiles' }, key: 'id' },
      },
      playerProfileId: {
        type: Sequelize.INTEGER,
        unique: false,
        references: { model: { tableName: 'profiles' }, key: 'id' },
      },
      participationCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE(3),
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE(3),
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.dropTable('repeat_bookings');
  },
};
