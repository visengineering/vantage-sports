import {
  ReferralSourceEnum,
  ReferralSourceIdEnum,
  ReferrralSourceTableName,
} from '../../models/ReferralSource';
import { QueryInterface, Sequelize } from 'sequelize/types';
import { DataTypes } from 'sequelize';
import { ProfileTableName } from '../../models/Profile';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    try {
      await queryInterface.createTable(ReferrralSourceTableName, {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        name: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
      });
      await queryInterface.addIndex(ReferrralSourceTableName, ['name']);
      await queryInterface.bulkInsert(ReferrralSourceTableName, [
        {
          id: ReferralSourceIdEnum.FACEBOOK,
          name: ReferralSourceEnum.FACEBOOK,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: ReferralSourceIdEnum.INSTAGRAM,
          name: ReferralSourceEnum.INSTAGRAM,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: ReferralSourceIdEnum.TIKTOK,
          name: ReferralSourceEnum.TIKTOK,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: ReferralSourceIdEnum.COACH_FROM_VANTAGE,
          name: ReferralSourceEnum.COACH_FROM_VANTAGE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: ReferralSourceIdEnum.FRIEND_USING_VANTAGE,
          name: ReferralSourceEnum.FRIEND_USING_VANTAGE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: ReferralSourceIdEnum.PEACH_JAR,
          name: ReferralSourceEnum.PEACH_JAR,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: ReferralSourceIdEnum.GOOGLE,
          name: ReferralSourceEnum.GOOGLE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: ReferralSourceIdEnum.OTHER,
          name: ReferralSourceEnum.OTHER,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      await queryInterface.addColumn(ProfileTableName, 'referralSourceId', {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: { tableName: ReferrralSourceTableName },
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
      await queryInterface.removeColumn(ProfileTableName, 'referralSourceId');
      await queryInterface.removeIndex(ReferrralSourceTableName, ['name']);
      await queryInterface.dropTable(ReferrralSourceTableName);
    } catch (error) {
      console.log('Failed migration (down) script:\n\n', error, '\n\n');
      throw error;
    }
  },
};
