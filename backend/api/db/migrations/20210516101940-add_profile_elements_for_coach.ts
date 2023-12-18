'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    var profileDesc = await queryInterface.describeTable('profiles');

    if (!profileDesc.skill1Id) {
      await queryInterface.addColumn('profiles', 'skill1Id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (!profileDesc.skill2Id) {
      await queryInterface.addColumn('profiles', 'skill2Id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (!profileDesc.skill3Id) {
      await queryInterface.addColumn('profiles', 'skill3Id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (!profileDesc.skill4Id) {
      await queryInterface.addColumn('profiles', 'skill14d', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (!profileDesc.class) {
      await queryInterface.addColumn('profiles', 'class', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (!profileDesc.height) {
      await queryInterface.addColumn('profiles', 'height', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!profileDesc.weight) {
      await queryInterface.addColumn('profiles', 'weight', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!profileDesc.hometown) {
      await queryInterface.addColumn('profiles', 'hometown', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!profileDesc.bio) {
      await queryInterface.addColumn('profiles', 'bio', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!profileDesc.cellphone) {
      await queryInterface.addColumn('profiles', 'cellphone', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!profileDesc.bannerImage) {
      await queryInterface.addColumn('profiles', 'bannerImage', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!profileDesc.profileImage) {
      await queryInterface.addColumn('profiles', 'profileImage', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
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
