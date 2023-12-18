'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    const tableName = 'profiles';
    const columnName = 'inflcr';

    queryInterface.describeTable(tableName).then((tableDefinition: any) => {
      if (tableDefinition[columnName]) {
        return Promise.resolve();
      }
      return queryInterface.addColumn(
        tableName,
        columnName,
        { type: Sequelize.BOOLEAN, allowNull: true, unique: false } // or a different column
      );
    });
  },

  down: async (queryInterface: any, Sequelize: any) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
