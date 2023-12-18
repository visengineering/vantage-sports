'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.dropTable('reviews');
    await queryInterface.createTable('reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      coachProfileId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: { tableName: 'profiles' }, key: 'id' },
      },
      playerProfileId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: { tableName: 'profiles' }, key: 'id' },
      },
      eventId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: { tableName: 'events' }, key: 'id' },
      },
      comment: { type: Sequelize.STRING, unique: false },
      rating: {
        type: Sequelize.FLOAT,
        max: 5,
        min: 1,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface: any) => {
    await queryInterface.dropTable('reviews');
  },
};
