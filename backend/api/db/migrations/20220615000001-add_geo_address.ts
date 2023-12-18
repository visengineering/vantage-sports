import { DataTypes } from 'sequelize';
import { QueryInterface, Sequelize } from 'sequelize/types';
import { GeoAddressTableName } from '../../models/GeoAddress';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    try {
      await queryInterface.createTable(GeoAddressTableName, {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },

        streetNumber: { type: DataTypes.STRING },
        route: { type: DataTypes.STRING },
        area: { type: DataTypes.STRING },
        city: { type: DataTypes.STRING },
        region: { type: DataTypes.STRING },
        state: { type: DataTypes.STRING },
        postalCode: { type: DataTypes.STRING },
        country: { type: DataTypes.STRING },

        formattedAddress: { type: DataTypes.STRING },
        placeId: { type: DataTypes.STRING },
        name: { type: DataTypes.STRING },

        geometryLocationLat: {
          type: DataTypes.DECIMAL(8, 6),
          validate: { min: -90, max: 90 },
        },
        geometryLocationLng: {
          type: DataTypes.DECIMAL(9, 6),
          validate: { min: -180, max: 180 },
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
      await queryInterface.dropTable(GeoAddressTableName);
    } catch (error) {
      console.log('Failed migration (down) script:\n\n', error, '\n\n');
      throw error;
    }
  },
};
