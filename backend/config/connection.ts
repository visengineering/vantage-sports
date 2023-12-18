import { Dialect } from 'sequelize';

type Connection = {
  database: string;
  username: string;
  password: string;
  host: string;
  port: string;
  dialect: Dialect;
  logging?: boolean;
  sync: { force: boolean };
};

const development: Connection = {
  database: process.env.DB_NAME ?? 'vantage_dev',
  username: process.env.DB_USER ?? 'vantage',
  password: process.env.DB_PASS ?? '1',
  host: process.env.DB_HOST ?? 'localhost',
  port: process.env.DB_PORT ?? '5432',
  dialect: 'postgres',
  sync: { force: false },
};

const testing: Connection = {
  database: 'databasename',
  username: 'username',
  password: 'password',
  host: 'localhost',
  port: '5432',
  sync: { force: false },
  dialect: 'postgres', // Was 'sqlite' || 'mysql' || 'postgres', not sure what for...
};

const production: Connection = {
  database: 'dflkl29igpsr1p',
  password: 'peafc265d7989a039346281eede9fcba2d1626b32acd17db19cfa662748fcd25e',
  username: 'u3bv5nck906pk9',
  port: '5432',
  host: 'ec2-34-227-38-126.compute-1.amazonaws.com',
  dialect: 'postgres',
  logging: true,
  sync: { force: false },
};

const staging: Connection = {
  database: 'd1n3kg8849ltb7',
  password: 'a81007c965d4093dcc09b81f3358d9301129a9cf87efc6252daa0ddb06b97779',
  username: 'glgzdihoupzmcf',
  port: '5432',
  host: 'ec2-44-193-150-214.compute-1.amazonaws.com',
  dialect: 'postgres',
  logging: true,
  sync: { force: false },
};

const dev2: Connection = {
  database: process.env.DB_NAME ?? '',
  password: process.env.DB_PASS ?? '',
  username: process.env.DB_USER ?? '',
  port: '5432',
  host: process.env.DB_HOST ?? '',
  dialect: 'postgres',
  logging: true,
  sync: { force: false },
};

console.log('Config/Connections.ts loaded:');
export { development, testing, production, staging, dev2 };
export default { development, testing, production, staging, dev2 };
