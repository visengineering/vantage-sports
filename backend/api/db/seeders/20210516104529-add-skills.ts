'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    try {
      for (const sport of [2, 3, 16]) {
        await queryInterface.bulkInsert(
          'skills',
          [
            {
              sportId: 4,
              name: 'Hitting',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 4,
              name: 'Defense',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 4,
              name: 'Fielding',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 4,
              name: 'Baserunning',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 4,
              name: 'Footwork & Agility',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 4,
              name: 'Strength & Conditioning',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 4,
              name: 'Recruiting',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 7,
              name: 'Shooting',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 7,
              name: 'Dribbling',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 7,
              name: 'Passing',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 7,
              name: 'Defense',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 7,
              name: 'Footwork & Agility',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 7,
              name: 'Strength & Conditioning',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 7,
              name: 'Recruiting',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 6,
              name: 'Shooting',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 6,
              name: 'Dribbling',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 6,
              name: 'Passing',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 6,
              name: 'Defense',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 6,
              name: 'Footwork & Agility',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 6,
              name: 'Strength & Conditioning',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 6,
              name: 'Recruiting',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 5,
              name: 'Catching/Route Running',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 5,
              name: 'Footwork',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 5,
              name: 'Game Situations',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 5,
              name: 'Throwing',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 5,
              name: 'Blocking',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 5,
              name: 'Pass Rush',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 5,
              name: 'Footwork & Agility',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 5,
              name: 'Strength & Conditioning',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 5,
              name: 'Recruiting',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 11,
              name: 'Driving',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 11,
              name: 'Irons',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 11,
              name: 'Chipping',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 11,
              name: 'Putting',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 11,
              name: 'General Swing',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 11,
              name: 'Strength & Conditioning',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 11,
              name: 'Recruiting',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 1,
              name: 'Basics',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 1,
              name: 'Dodging',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 1,
              name: 'Shooting',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 1,
              name: 'Faceoff',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 1,
              name: 'Defense',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 1,
              name: 'Goalie',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 1,
              name: 'Footwork & Agility',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 1,
              name: 'Strength & Conditioning',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 1,
              name: 'Recruiting',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 2,
              name: 'Basics',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 2,
              name: 'Dodging',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 2,
              name: 'Shooting',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 2,
              name: 'Faceoff',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 2,
              name: 'Defense',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 2,
              name: 'Goalie',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 2,
              name: 'Footwork & Agility',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 2,
              name: 'Strength & Conditioning',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 2,
              name: 'Recruiting',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 12,
              name: 'Basics',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 12,
              name: 'Forehand',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 12,
              name: 'Backhand',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 12,
              name: 'Serving',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 12,
              name: 'Drop Shot',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 12,
              name: 'Footwork & Agility',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 12,
              name: 'Strength & Conditioning',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 12,
              name: 'Recruiting',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 10,
              name: 'Basics',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 10,
              name: 'Dribbling',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 10,
              name: 'Shooting',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 10,
              name: 'Defense',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 10,
              name: 'Goaltending',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 10,
              name: 'Footwork & Agility',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 10,
              name: 'Strength & Conditioning',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 10,
              name: 'Recruiting',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 3,
              name: 'Hitting',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 3,
              name: 'Defense',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 3,
              name: 'Fielding',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 3,
              name: 'Baserunning',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 3,
              name: 'Footwork & Agility',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 3,
              name: 'Strength & Conditioning',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              sportId: 3,
              name: 'Recruiting',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          {}
        );
      }
    } catch (error) {
      console.log('Failed seed script:\n\n', error, '\n\n');
      throw error;
    }
  },

  down: async (queryInterface: any, Sequelize: any) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
