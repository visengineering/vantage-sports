'use strict';
module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      password: { type: Sequelize.STRING },
      username: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
      admin: { type: Sequelize.BOOLEAN, allowNull: true },
      token: { type: Sequelize.STRING, allowNull: true },
      source: { type: Sequelize.STRING, allowNull: true },
      termsOfService: { type: Sequelize.BOOLEAN, allowNull: true },
      privacyPolicy: { type: Sequelize.BOOLEAN, allowNull: true },
      userType: { type: Sequelize.STRING, allowNull: true },
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
    await queryInterface.dropTable('universities');
  },
};
