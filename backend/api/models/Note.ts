import Sequelize from 'sequelize';

import db from '../../config/database';

const tableName = 'notes';

export const Note = db.define(
  'Note',
  {
    note: {
      type: Sequelize.STRING,
    },
  },
  { tableName }
);

export default Note;
