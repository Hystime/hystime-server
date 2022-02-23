import { createConnection } from 'typeorm';
import { generate } from './main';

const iServer = generate();
const { server, connection, token } = iServer;
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

module.exports = server;
