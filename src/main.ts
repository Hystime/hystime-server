import {ApolloServer, AuthenticationError} from 'apollo-server';
import {ConnectionOptions, createConnection} from "typeorm";
import {nanoid} from 'nanoid'

import resolver from './resolvers';
import schemas from './schemas';
import entities from './entities'

import * as fs from "fs";


async function start() {
    const tokenPath = '.token'
    let token: string

    const exist = await new Promise((resolve) => {
        fs.exists(tokenPath, (exists) => {
            resolve(exists)
        })
    })
    if (exist) {
        token = fs.readFileSync(tokenPath).toString()
    } else {
        token = nanoid(32)
        fs.writeFileSync(tokenPath, token)
    }

    let dbConfig: ConnectionOptions
    if (process.env.NODE_ENV === "development") {
        dbConfig = {
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "123456",
            database: "hystime",
            synchronize: true,
            entities: entities
        }
    } else {
        type supportedDatabase = "mysql" | "mariadb" | "postgres"
        dbConfig = {
            type: process.env["DB_TYPE"] as supportedDatabase || "mysql",
            host: process.env["DB_HOST"] || "localhost",
            port: Number(process.env["DB_PORT"]) || 3306,
            username: process.env["DB_USERNAME"],
            password: process.env["DB_USERPWD"],
            database: process.env["DB_NAME"],
            synchronize: true,
            entities: entities
        }
    }

    await createConnection(dbConfig);

    const server = new ApolloServer({
            typeDefs: schemas,
            resolvers: resolver,
            context: ({req}) => {
                const userToken = req.headers.Auth || '';

                if (process.env.NODE_ENV === 'production') {
                    if (userToken !== token)
                        throw new AuthenticationError('Incorrect access token');
                }
            },
        }
    );
    const serverInfo = await server.listen()

    console.log(`Server ready at ${serverInfo.url}. `)
}


if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => console.log('Module disposed. '));
}

start()
