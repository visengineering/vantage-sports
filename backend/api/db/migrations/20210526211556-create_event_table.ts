'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable('events', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      profileId: { type: Sequelize.INTEGER },
      universityId: { type: Sequelize.INTEGER },
      sportId: { type: Sequelize.INTEGER },
      positionId: { type: Sequelize.INTEGER },
      skillId: { type: Sequelize.INTEGER },
      max: { type: Sequelize.INTEGER },
      duration: { type: Sequelize.DECIMAL(10, 2) },
      sessionType: { type: Sequelize.STRING },
      cost: { type: Sequelize.DECIMAL(10, 2) },
      date: { type: Sequelize.DATE },
      time: { type: Sequelize.TIME },
      location: { type: Sequelize.STRING },
      title: { type: Sequelize.STRING },
      description: { type: Sequelize.STRING },
      mediaId: { type: Sequelize.INTEGER },
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
    await queryInterface.dropTable('events');
  },
};
