'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable('resets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
      key: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE(3), defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE(3), defaultValue: Sequelize.NOW },
    });
  },

  down: async (queryInterface: any, Sequelize: any) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
