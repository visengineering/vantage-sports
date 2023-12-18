console.log('start');
import csv from 'async-csv';
const fs = require('fs').promises;
import path from 'path';

import { University } from '../../models';
import { Conference } from '../../models';
import { Division } from '../../models';

console.log('required');

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    try {
      let divisions: any = {};
      let conferences: any = {};
      console.log('start of loop');
      const csvString = await fs.readFile(
        path.join(__dirname, 'university_import.csv')
      );
      const rows: any[] = await csv.parse(csvString);
      rows.shift();

      for (const row of rows) {
        console.log('row');
        let school_name = row[0];
        let city = row[1];
        let state = row[2];
        let conference_name = row[3];
        let division_name = row[4];
        let conference = conferences[conference_name];
        let division = divisions[division_name];

        console.log(conferences);
        if (conference == undefined) {
          conference = (await Conference.create({ name: conference_name })).id;
          conferences[conference_name] = conference;
        }

        if (division == undefined) {
          division = (await Division.create({ name: division_name })).id;
          divisions[division_name] = division;
        }

        await University.create({
          name: school_name,
          state: state,
          city: city,
          conferenceId: conference,
          divisionId: division,
        });
      }
    } catch (error) {
      console.log('Failed seed script:\n\n', error, '\n\n');
      throw error;
    }
  },

  down: async (queryInterface: any, Sequelize: any) => {},
};
