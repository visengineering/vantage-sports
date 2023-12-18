import {
  EventsTableName,
  EventTypeColumn,
  EventTypeColumnName,
} from '../../../api/models/Event';
import { QueryInterface, Sequelize } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    try {
      await queryInterface.sequelize.query(
        `DROP TYPE IF EXISTS "enum_${EventsTableName}_${EventTypeColumnName}" CASCADE;`
      );
      queryInterface.addColumn(
        EventsTableName,
        EventTypeColumnName,
        EventTypeColumn
      );
    } catch (error) {
      console.log('Failed migration up() script:\n\n', error, '\n\n');
      throw error;
    }
  },

  down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    try {
      if (
        (await queryInterface.describeTable(EventsTableName))[
          EventTypeColumnName
        ]
      ) {
        await queryInterface.removeColumn(EventsTableName, EventTypeColumnName);
      }
      await queryInterface.sequelize.query(
        `DROP TYPE IF EXISTS "enum_${EventsTableName}_${EventTypeColumnName}" CASCADE;`
      );
    } catch (error) {
      console.log('Failed migration down() script:\n\n', error, '\n\n');
      throw error;
    }
  },
};
