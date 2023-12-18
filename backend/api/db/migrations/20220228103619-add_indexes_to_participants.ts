'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.addIndex('participants', ['clientId']),
      queryInterface.addIndex('participants', ['paymentReference']),
      queryInterface.addIndex('participants', ['coachId']),
      queryInterface.addIndex('participants', ['eventId']),
      queryInterface.addIndex('participants', [
        'clientId',
        'paymentReference',
        'reviewId',
        'updatedAt',
      ]),
      queryInterface.addIndex('participants', ['clientId', 'eventId']),
    ]);
  },

  down: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([
      queryInterface.removeIndex('participants', ['clientId']),
      queryInterface.removeIndex('participants', ['paymentReference']),
      queryInterface.removeIndex('participants', ['coachId']),
      queryInterface.removeIndex('participants', ['eventId']),
      queryInterface.removeIndex('participants', [
        'clientId',
        'paymentReference',
        'reviewId',
        'updatedAt',
      ]),
      queryInterface.removeIndex('participants', ['clientId', 'eventId']),
    ]);
  },
};
