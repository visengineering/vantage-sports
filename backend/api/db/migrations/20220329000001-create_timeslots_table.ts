import { TimeslotTableDefinition } from '../../../api/models';
import { QueryInterface, Sequelize } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    try {
      try {
        if ((await queryInterface.describeTable('timeslots')).id) {
          await queryInterface.dropTable('timeslots');
        }
      } catch (_) {}
      await queryInterface.createTable('timeslots', TimeslotTableDefinition, {
        uniqueKeys: {
          eventid_startdate_enddate_unique: {
            fields: ['eventId', 'startDate', 'endDate'],
            customIndex: true,
          },
          eventid_timeslot_unique: {
            fields: ['eventId', 'timeslot'],
            customIndex: true,
          },
        },
      });
    } catch (error) {
      console.log('Failed migration up() script:\n\n', error, '\n\n');
      throw error;
    }
  },

  down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    try {
      await queryInterface.dropTable('timeslots');
    } catch (error) {
      console.log('Failed migration down() script:\n\n', error, '\n\n');
      throw error;
    }
  },
};
