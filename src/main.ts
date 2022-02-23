import { ApolloServer, AuthenticationError } from 'apollo-server';
import { ConnectionOptions, createConnection, getConnection } from 'typeorm';
import { makeExecutableSchema } from '@graphql-tools/schema';
import sourceMapSupport from 'source-map-support';
import { nanoid } from 'nanoid';
import * as fs from 'fs';

import resolver from './resolvers';
import typedefs from './typedefs';
import entities from './entities';

import { fileExist, isDebug, serverUrl } from './utils/utils';
import { createDebugData } from './debug';

sourceMapSupport.install({
  environment: 'node',
  handleUncaughtExceptions: true,
  hookRequire: isDebug(),
});

interface IServer {
  server: ApolloServer;
  connection: ConnectionOptions;
  token: string;
}

function generate(): IServer {
  const tokenPath = '.token';
  let token: string;

  const tokenExist = fileExist(tokenPath);

  if (tokenExist) {
    token = fs.readFileSync(tokenPath).toString().trim();
  } else {
    if (process.env['TOKEN']) {
      token = process.env['TOKEN'];
    } else {
      token = nanoid(8);
      fs.writeFileSync(tokenPath, token);
    }
  }

  let dbConfig: ConnectionOptions;
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG) {
    dbConfig = {
      type: 'mysql',
      host: process.env['DB_HOST'] || (process.env.DEBUG ? '172.17.0.1' : 'localhost'),
      port: Number(process.env['DB_PORT']) || 3306,
      username: process.env['DB_USERNAME'] || 'root',
      password: process.env['DB_USERPWD'] || '123456',
      database: process.env['DB_NAME'] || 'hystime',
      synchronize: true,
      entities: entities,
    };
  } else {
    ['DB_USERNAME', 'DB_USERPWD', 'DB_NAME'].forEach((key) => {
      if (!process.env[key]) {
        throw new Error(`${key} is not defined`);
      }
    });

    type supportedDatabase = 'mysql' | 'mariadb' | 'postgres';
    if (
      process.env['DB_TYPE'] &&
      !['mysql', 'mariadb', 'postgres'].includes(process.env['DB_TYPE'])
    ) {
      throw new Error(`Unsupported database ${process.env['DB_TYPE']}`);
    }
    dbConfig = {
      type: (process.env['DB_TYPE'] as supportedDatabase) || 'mysql',
      host: process.env['DB_HOST'] || 'localhost',
      port: Number(process.env['DB_PORT']) || 3306,
      username: process.env['DB_USERNAME'],
      password: process.env['DB_USERPWD'],
      database: process.env['DB_NAME'],
      synchronize: true,
      entities: entities,
    };
  }

  const schema = makeExecutableSchema({
    typeDefs: typedefs,
    resolvers: resolver,
  });

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const userToken = req.headers.auth || '';
      if (process.env.NODE_ENV === 'production') {
        if (userToken !== token) throw new AuthenticationError('Incorrect access token');
      } else {
        if (userToken !== token) {
          console.log(`error token "${userToken}" not same as ${token}`);
        }
      }
    },
    cors: {
      origin: '*',
      credentials: true,
    },
    introspection: true,
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
      server.stop().then(() => console.error('Server stopped'));
      getConnection()
        .close()
        .then(() => {
          console.error('Connection closed');
        });
    });
  }

  return {
    server,
    connection: dbConfig,
    token,
  };
}

const iServer = generate();

if (process.env.VERCEL === undefined) {
  if (isDebug()) {
    if (module.hot && module.hot.status() === 'apply') {
      setTimeout(start, 1000);
    } else {
      start();
    }
  }

  function start(): void {
    const { server, connection, token } = iServer;
    server
      .listen({
        port: process.env['PORT'] || 4000,
        host: process.env['HOST'] || '0.0.0.0',
      })
      .then((serverInfo) => {
        console.log(`Server ready at ${serverUrl(serverInfo)}`);
        console.log(`Token: ${token}`);
        createConnection(connection)
          .then(() => {
            console.log('Database connected');
            createDebugData().then(() => {
              console.log('Debug data created');
            });
          })
          .catch((err) => {
            console.error('Database connection error: ', err);
            process.exit(1);
          });
      });
  }
} else {
  const { connection, token } = iServer;
  console.log(`Server ready at ${process.env.VERCEL_URL}`);
  console.log(`Token: ${token}`);
  createConnection(connection)
    .then(() => {
      console.warn('Database connected');
    })
    .catch((err) => {
      console.error('Database connection error: ', err);
      process.exit(1);
    });
}

module.exports = iServer.server;
