module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    try {
      await queryInterface.bulkInsert(
        'sports',
        [
          {
            name: "Men's Lacrosse",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Women's Lacrosse",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Women's Softball",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          { name: 'Baseball', createdAt: new Date(), updatedAt: new Date() },
          { name: 'Football', createdAt: new Date(), updatedAt: new Date() },
          {
            name: "Men's Basketball",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Women's Basketball",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          { name: 'Soccer', createdAt: new Date(), updatedAt: new Date() },
          { name: 'Other', createdAt: new Date(), updatedAt: new Date() },
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
