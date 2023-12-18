'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable('medias', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: { type: Sequelize.STRING },
      url: { type: Sequelize.STRING },
      type: { type: Sequelize.STRING },
      externalId: { type: Sequelize.STRING },
      eventId: { type: Sequelize.INTEGER, allowNull: true, unique: false },
      profileId: { type: Sequelize.INTEGER, allowNull: true, unique: false },
      contentId: { type: Sequelize.INTEGER, allowNull: true, unique: false },
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
