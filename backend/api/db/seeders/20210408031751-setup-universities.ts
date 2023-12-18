'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    try {
      await queryInterface.bulkInsert(
        'universities',
        [
          {
            name: 'Rutgers',
            createdAt: new Date(),
            updatedAt: new Date(),
            state: 'NJ',
          },
          {
            name: 'Boston College',
            createdAt: new Date(),
            updatedAt: new Date(),
            state: 'MA',
          },
          {
            name: 'Boston University',
            createdAt: new Date(),
            updatedAt: new Date(),
            state: 'MA',
          },
        ],
        {
          ignoreDuplicates: true,
        }
      );
    } catch (error) {
      console.log('Failed seed script:\n\n', error, '\n\n');
      throw error;
    }
  },

  down: async (queryInterface: any, Sequelize: any) => {},
};
