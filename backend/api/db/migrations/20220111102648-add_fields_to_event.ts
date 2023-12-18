'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.addColumn('events', 'dailyReminderAt', {
        type: Sequelize.DATE(3),
        defaultValue: null,
      }),
    ]);
  },
  down: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.removeColumn('events', 'dailyReminderAt'),
    ]);
  },
};
