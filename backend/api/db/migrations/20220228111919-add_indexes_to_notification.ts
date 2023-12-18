'use strict';

import { QueryInterface } from 'sequelize/types';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    return Promise.all([
      queryInterface.addIndex('notifications', [
        'type',
        'subject',
        'userId',
        'toEmail',
        'eventIds',
        'notification_medium',
        'userType',
      ]),
    ]);
  },

  down: async (queryInterface: QueryInterface, Sequelize: any) => {
    return Promise.all([
      queryInterface.removeIndex('notifications', [
        'type',
        'subject',
        'userId',
        'toEmail',
        'eventIds',
        'notification_medium',
        'userType',
      ]),
    ]);
  },
};
