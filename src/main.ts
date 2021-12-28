import { ApolloServer, AuthenticationError } from 'apollo-server';
import { ConnectionOptions, createConnection } from 'typeorm';
import { nanoid } from 'nanoid';

import resolver from './resolvers';
import typedefs from './typedefs';
import entities from './entities';

import * as fs from 'fs';
import { makeExecutableSchema } from '@graphql-tools/schema';

async function start(): Promise<string> {
  const tokenPath = '.token';
  let token: string;

  const exist = await new Promise((resolve) => {
    fs.exists(tokenPath, (exists) => {
      resolve(exists);
    });
  });
  if (exist) {
    token = fs.readFileSync(tokenPath).toString();
  } else {
    if (process.env.token) {
      token = process.env.token;
    } else {
      token = nanoid(8);
      fs.writeFileSync(tokenPath, token);
    }
  }

  let dbConfig: ConnectionOptions;
  if (process.env.NODE_ENV === 'development') {
    dbConfig = {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'hystime',
      synchronize: true,
      entities: entities,
    };
  } else {
    type supportedDatabase = 'mysql' | 'mariadb' | 'postgres';
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

  await createConnection(dbConfig);

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
        if (userToken !== token) console.log(`error token ${userToken}`);
      }
    },
    cors: {
      origin: '*',
      credentials: true,
    },
    introspection: true,
  });
  const serverInfo = await server.listen({
    port: process.env.PORT || 4000,
    host: process.env.HOST || '0.0.0.0',
  });

  console.log(`Server ready at ${serverInfo.url}. `);
  return token;
}

start().then((token) => console.log(`Server started with token ${token}`));
