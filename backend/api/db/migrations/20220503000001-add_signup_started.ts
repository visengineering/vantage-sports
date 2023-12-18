import { SignupStartedTableName } from '../../models/SignupStarted';
import { QueryInterface, Sequelize } from 'sequelize/types';
import { DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    try {
      await queryInterface.createTable(SignupStartedTableName, {
        email: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
        numberOfTries: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: false,
          defaultValue: 1,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      });
    } catch (error) {
      console.log('Failed migration (up) script:\n\n', error, '\n\n');
      throw error;
    }
  },

  down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    try {
      await queryInterface.dropTable(SignupStartedTableName);
    } catch (error) {
      console.log('Failed migration (down) script:\n\n', error, '\n\n');
      throw error;
    }
  },
};
