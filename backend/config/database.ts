import { Sequelize } from 'sequelize';
import connection from './connection';
const pg = require('pg');

console.log(
  '\n\n Database configuration loaded:\n\n',
  process.env.NODE_ENV === 'production'
    ? 'production database configuration.'
    : process.env.NODE_ENV === 'staging'
    ? 'staging database configuration.'
    : process.env.NODE_ENV === 'dev2'
    ? 'dev2 database configuration.'
    : process.env.NODE_ENV === 'testing'
    ? 'Testing database configuration.'
    : 'Default DB config with connection object.',
  '\n\n'
);

// Override DATEONLY parser to correctly parse timeslots
pg.types.setTypeParser(1082, 'text', function (text: any) {
  return text;
});

export const database =
  process.env.NODE_ENV === 'production'
    ? new Sequelize(
        `${process.env.DATABASE_CONNECTION_POOL || process.env.DATABASE_URL}`,
        {
          dialect: 'postgres',
          logging: false,
          dialectOptions: {
            ssl: {
              rejectUnauthorized: false, // very important
            },
          },
        }
      )
    : process.env.NODE_ENV === 'staging'
    ? new Sequelize(
        `${process.env.DATABASE_CONNECTION_POOL || process.env.DATABASE_URL}`,
        {
          dialect: 'postgres',
          logging: false,
          dialectOptions: {
            ssl: {
              rejectUnauthorized: false, // very important
            },
          },
        }
      )
    : process.env.NODE_ENV === 'dev2'
    ? new Sequelize(
        `${
          process.env.DATABASE_CONNECTION_POOL || process.env.DATABASE_URL
        }?sslmode=no-verify`,
        {
          dialect: 'postgres',
          logging: false,
          dialectOptions: {
            ssl: {
              rejectUnauthorized: false, // very important
            },
          },
        }
      )
    : process.env.NODE_ENV === 'testing'
    ? new Sequelize(
        connection.testing.database,
        connection.testing.username,
        connection.testing.password,
        {
          host: connection.testing.host,
          dialect: connection.testing.dialect,
          pool: {
            max: 2,
            min: 0,
            acquire: 30000,
            idle: 10000,
          },
        }
      )
    : new Sequelize(
        connection.development.database,
        connection.development.username,
        connection.development.password,
        {
          sync: { force: false },
          host: connection.development.host,
          dialect: connection.development.dialect,
          ssl: true,
          pool: {
            max: 5,
            min: 0,
            idle: 10000,
          },
        }
      );

export default database;
