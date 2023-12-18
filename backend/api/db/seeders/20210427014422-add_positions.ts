'use strict';
import csv from 'async-csv';
const fs = require('fs').promises;
import path from 'path';

import { Sport } from '../../models';
import { Position } from '../../models';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    try {
      let sports: any = {};

      const csvString = await fs.readFile(
        path.join(__dirname, 'position_import.csv')
      );
      const rows: any[] = await csv.parse(csvString);
      rows.shift();

      for (const row of rows) {
        let sport_name = row[0];
        let position_name = row[1];
        let sport = sports[sport_name];

        if (sport == undefined) {
          let sport_record = await Sport.findOne({
            where: { name: sport_name },
          });
          if (sport_record != null) {
            sport = sport_record.id;
          }

          if (sport == null || sport == undefined) {
            sport = (await Sport.create({ name: sport_name })).id;
            sports[sport_name] = sport;
          }
        }

        let position = await Position.findOne({
          where: { name: position_name, sportId: sport },
        });
        if (position == null) {
          await Position.create({ name: position_name, sportId: sport });
        }
      }
    } catch (error) {
      console.log('Failed seed script:\n\n', error, '\n\n');
      throw error;
    }
  },

  down: async (queryInterface: any, Sequelize: any) => {},
};
