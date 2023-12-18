'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([queryInterface.addIndex('profiles', ['cellphone'])]);
  },

  down: async (queryInterface: any, Sequelize: any) => {
    return Promise.all([queryInterface.removeIndex('profiles', ['cellphone'])]);
  },
};
