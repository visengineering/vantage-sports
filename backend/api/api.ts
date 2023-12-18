if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import { default as express, Request, Response, NextFunction } from 'express';

import dbService from './services/db.service';

import bodyParser from 'body-parser';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import Helmet from 'helmet';
import http from 'http';
import cookieParser from 'cookie-parser';
import JWTService from './services/auth.service';
import path from 'path';
import { configuration } from '../config/';
import logger from './helpers/logger';
import { mapRoutes } from './mapRoutes';
import { extractJwt } from './controllers/AuthController';
import { requireHTTPS } from './helpers/forceHttps';
import { requireWwwHost } from './helpers/forceWww';
import { v4 as uuidv4 } from 'uuid';
import morgan from 'morgan';
import { ApolloLogPlugin } from './helpers/apollo-log';
import compression from 'compression';

/**
 * server configuration
 */
let { schema } = require('./graphql');

const environment = process.env.NODE_ENV;
logger.info(`Environment is set to ${environment}`);

// environment: development, testing, production

// Logging base for DB: https://github.com/expressjs/morgan#split--dual-logging
// see also backend/api/helpers/logger.ts

morgan.token('id', function getId(req: Request & { id: string }) {
  return req.id ?? '';
});

const assignId = (req: Request, res: Response, next: NextFunction) => {
  (req as any).id = uuidv4();
  next();
};

/**
 * express application
 */
const api = express();
api.use(requireHTTPS);
api.use(requireWwwHost);

// Compress all HTTP responses
// You can filter out some endpoints if you need to, read more:
// https://medium.com/@victor.valencia.rico/gzip-compression-with-node-js-cc3ed74196f9
api.use(compression());

api.use(express.static(__dirname + '/static-client'));

if (process.env.NODE_ENV !== 'development') {
  // Trust proxy for redirects (https / www.)
  // Enable reverse proxy support in Express. This causes the
  // the "X-Forwarded-Proto" header field to be trusted so its
  // value can be used to determine the protocol. See
  // http://expressjs.com/api#app-settings for more details.
  // Read more: https://www.tonyerwin.com/2014/09/redirecting-http-to-https-with-nodejs.html
  // Read more: https://stackoverflow.com/questions/23413401/what-does-trust-proxy-actually-do-in-express-js-and-do-i-need-to-use-it
  api.enable('trust proxy');
}

const server = new http.Server(api);

api.use(cookieParser());

const DB = dbService(environment).start();

//https://flaviocopes.com/graphql-auth-apollo-jwt-cookies/
const corsOptions = {
  origin: process.env.REACT_APP_API ? [process.env.REACT_APP_API] : [],
  credentials: true,
};

console.log(`Cors: ${corsOptions.origin}`);
// Logger ====================================================================
// Load logger after the database initialization. Required for database logging.

api.use(assignId);
// https://github.com/expressjs/morgan#http-version
api.use(
  morgan(
    ':id :url :status :method (Resp.time: :response-time ms) - (morgan: :total-time ms) (Refferrer: :referrer) (User agent: :user-agent) (Http version: :http-version)' as any,
    {
      // https://github.com/expressjs/morgan
      skip: function (req: Request, res: Response) {
        // log only 4xx and 5xx responses to console
        return res.statusCode < 400;
      },
      stream: {
        write: function (message: unknown) {
          logger.info(message);
        },
      },
    }
  )
);

// allow cross origin requests
// configure to allow only requests from certain origins
api.use(cors(corsOptions));

// secure express app
api.use(
  Helmet({
    contentSecurityPolicy: false,
    // TODO: maybe improve in the future?
    // // Sets the `script-src` directive to "'self' 'nonce-e33ccde670f149c1789b1e1e113b0916'" (or similar)
    // api.use((req: any, res: any, next: any) => {
    //   res.locals.cspNonce = crypto.randomBytes(16).toString('hex');
    //   next();
    // });
    // contentSecurityPolicy: {
    //   useDefaults: true,
    //   directives: {
    //     scriptSrc: [
    //       "'self'",
    //       (req: any, res: any) => `'nonce-${res.locals.cspNonce}'`,
    //     ],
    //   },
    // },
    dnsPrefetchControl: false,
    frameguard: false,
    ieNoOpen: false,
  })
);

// parsing the request bodys
// TODO: TypeScript suggests .use() accepts different type of objects.
api.use(bodyParser.urlencoded({ limit: '50mb', extended: false }) as any);
api.use(bodyParser.json({ limit: '50mb' }) as any);

api.get('/health_check', (req: Request, res: Response, next) =>
  res.send('Number 5 Is Alive')
);

const routes = mapRoutes(configuration.publicRoutes, 'api/controllers/');
// public REST API
api.use('/rest', routes);
// schema = applyMiddleware(schema, shieldPermissions);

const graphQLServer = new ApolloServer({
  plugins: [
    ApolloLogPlugin({
      events: {
        didEncounterErrors: true,
        didResolveOperation: false,
        executionDidStart: false,
        parsingDidStart: false,
        responseForOperation: false,
        validationDidStart: false,
        willSendResponse: false,
      },
    }),
  ],
  schema,
  introspection: process.env.NODE_ENV === 'development',
  debug: process.env.NODE_ENV === 'development',
  context: ({ req }: any) => {
    const allowedOperations = ['query Event', 'query Coach'];

    //This are the operations that require authentication
    const restrictedOperations = [
      'mutation updateCoach',
      'mutation createMedia',
      'mutation deleteMedia',
      'mutation deleteEvent',
      'mutation updateEvent',
      'mutation cancelEvent',
      'mutation deleteTimeslot',
      'mutation updateTimeslot',
      'mutation cancelTimeslot',
      'query Participant',
      'query Review',
    ];

    const reqOperation = req?.body?.query;
    let requireAuthentication = false;
    const isAuthenticated = false;
    const currentUser = null;

    //This dont require authentication
    if (
      allowedOperations.some((operation) => reqOperation.includes(operation))
    ) {
      return { currentUser, isAuthenticated, requireAuthentication };
    }

    if (
      restrictedOperations.some((operation) => reqOperation.includes(operation))
    ) {
      requireAuthentication = true;
    }

    const token = extractJwt(req);

    if (!token) {
      return { isAuthenticated, currentUser, requireAuthentication };
    }

    const jwtVerifyCallback = (err: any, userToken: any) => {
      if (err) {
        return {
          isAuthenticated: false,
          currentUser: null,
          requireAuthentication: true,
        };
      }

      return {
        currentUser: userToken,
        isAuthenticated: true,
        requireAuthentication: true,
      };
    };

    return JWTService().verify(token, jwtVerifyCallback);
  },
});

graphQLServer.applyMiddleware({
  app: api,
  cors: false,
});

server.listen(configuration.port, () => {
  if (
    environment !== 'production' &&
    environment !== 'development' &&
    environment !== 'testing'
  ) {
    logger.error(
      `NODE_ENV is set to ${environment}, but only production and development are valid.`
    );
    process.exit(1);
  }
  console.log(`Service is running on port ${configuration.port}`);
  return DB;
});

api.get('*', (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    requireHTTPS(req, res, () => {});
  }
  res.sendFile(path.join(__dirname, '/static-client', 'index.html'));
});

export { api };
export default api;
