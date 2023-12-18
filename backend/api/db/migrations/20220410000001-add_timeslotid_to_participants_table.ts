import { QueryInterface, Sequelize } from 'sequelize';
import {
  ParticipantsTableName,
  ParticipantsTimeslotIdColumnName,
  TimeslotIdColumn,
} from '../../models/Participant';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    try {
      queryInterface.addColumn(
        ParticipantsTableName,
        ParticipantsTimeslotIdColumnName,
        TimeslotIdColumn
      );
    } catch (error) {
      console.log('Failed migration up() script:\n\n', error, '\n\n');
      throw error;
    }
  },

  down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    try {
      if (
        (await queryInterface.describeTable(ParticipantsTableName))[
          ParticipantsTimeslotIdColumnName
        ]
      ) {
        await queryInterface.removeColumn(
          ParticipantsTableName,
          ParticipantsTimeslotIdColumnName
        );
      }
    } catch (error) {
      console.log('Failed migration down() script:\n\n', error, '\n\n');
      throw error;
    }
  },
};
