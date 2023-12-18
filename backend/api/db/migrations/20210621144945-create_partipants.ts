'use strict';
module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable('participants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      clientId: { allowNull: false, type: Sequelize.INTEGER },
      coachId: { allowNull: false, type: Sequelize.INTEGER },
      eventId: { allowNull: false, type: Sequelize.INTEGER },
      paid: { type: Sequelize.BOOLEAN },
      paymentReference: { type: Sequelize.STRING },
      createdAt: {
        type: Sequelize.DATE(3),
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE(3),
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.dropTable('participants');
  },
};
