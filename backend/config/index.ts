import publicRoutes from './routes/publicRoutes';
import privateRoutes from './routes/privateRoutes';

export const configuration = {
  migrate: true,
  logLevel: 4,
  publicRoutes,
  privateRoutes,
  port: process.env.PORT || '2017',
};

export default configuration;
