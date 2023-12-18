import { QueryInterface, Sequelize } from 'sequelize';
import {
  FavoriteCoachTableDefinition,
  FavoriteCoachTableName,
} from '../../../api/models';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    try {
      await queryInterface.createTable(
        FavoriteCoachTableName,
        FavoriteCoachTableDefinition,
        {
          uniqueKeys: {
            coach_player_unique_pair: {
              fields: ['playerProfileId', 'coachProfileId'],
              customIndex: true,
            },
          },
        }
      );
      queryInterface.addIndex(FavoriteCoachTableName, [
        'playerProfileId',
        'coachProfileId',
      ]);
    } catch (error) {
      console.log('Failed migration up() script:\n\n', error, '\n\n');
      throw error;
    }
  },

  down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    try {
      await queryInterface.dropTable(FavoriteCoachTableName);
    } catch (error) {
      console.log('Failed migration down() script:\n\n', error, '\n\n');
      throw error;
    }
  },
};
