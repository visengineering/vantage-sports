import { DataTypes } from 'sequelize';
import { QueryInterface, Sequelize } from 'sequelize/types';
import { GeoAddressTableName } from '../../models/GeoAddress';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    try {
      await queryInterface.addColumn('profiles', 'geoAddressId', {
        type: DataTypes.INTEGER,
        unique: true,
        references: {
          model: { tableName: GeoAddressTableName },
          key: 'id',
        },
      });
    } catch (error) {
      console.log('Failed migration (up) script:\n\n', error, '\n\n');
      throw error;
    }
  },

  down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    try {
      await queryInterface.removeColumn('profiles', 'geoAddressId');
    } catch (error) {
      console.log('Failed migration (down) script:\n\n', error, '\n\n');
      throw error;
    }
  },
};
