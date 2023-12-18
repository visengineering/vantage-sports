'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable('profiles', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: Sequelize.INTEGER, unique: true },
      userType: { type: Sequelize.STRING, unique: false },
      type: { type: Sequelize.STRING, unique: false },
      sport: { type: Sequelize.INTEGER, unique: false },
      university: { type: Sequelize.INTEGER, unique: false },
      city: { type: Sequelize.STRING, unique: false },
      state: { type: Sequelize.STRING, unique: false },
      zip: { type: Sequelize.STRING, unique: false },
      position: { type: Sequelize.INTEGER, unique: false },
      skill: { type: Sequelize.STRING, unique: false },
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
    await queryInterface.dropTable('profiles');
  },
};
