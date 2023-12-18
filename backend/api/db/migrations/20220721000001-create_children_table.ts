import { QueryInterface, Sequelize } from 'sequelize';
import { DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    try {
      try {
        if ((await queryInterface.describeTable('children')).id) {
          await queryInterface.dropTable('children');
        }
      } catch (_) {}
      await queryInterface.createTable('children', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, unique: false },
        parentProfileId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: false,
          references: { model: { tableName: 'profiles' }, key: 'id' },
        },
        favoriteSportId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          unique: false,
          references: { model: { tableName: 'sports' }, key: 'id' },
        },
        favoritePositionId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          unique: false,
          references: { model: { tableName: 'positions' }, key: 'id' },
        },
        age: { type: DataTypes.INTEGER, unique: false, allowNull: false },
        remarks: { type: DataTypes.STRING, unique: false, allowNull: false },
        createdAt: { type: DataTypes.DATE(3), defaultValue: DataTypes.NOW },
        updatedAt: { type: DataTypes.DATE(3), defaultValue: DataTypes.NOW },
      });
    } catch (error) {
      console.log('Failed migration up() script:\n\n', error, '\n\n');
      throw error;
    }
  },

  down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    try {
      await queryInterface.dropTable('children');
    } catch (error) {
      console.log('Failed migration down() script:\n\n', error, '\n\n');
      throw error;
    }
  },
};
