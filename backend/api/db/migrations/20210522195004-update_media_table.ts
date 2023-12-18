'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    try {
      await queryInterface.addColumn('medias', 'publicId', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    } catch (error) {
      console.log('Failed migration script:\n\n', error, '\n\n');
      throw error;
    }
  },

  down: async (queryInterface: any, Sequelize: any) => {
    if ((await queryInterface.describeTable('medias')).publicId) {
      try {
        await queryInterface.removeColumn('medias', 'publicId');
      } catch (error) {
        console.log('Failed migration script:\n\n', error, '\n\n');
        throw error;
      }
    }
  },
};
