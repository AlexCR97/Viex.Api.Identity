import { Express, Request, Response } from 'express'
import { MikroORM, RequestContext } from "@mikro-orm/core";
import config from '@/config.json'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { User } from './users/User.entity';
import { BaseEntity } from './Base.entity';
import IdentityContext from './IdentityContext';
import { RefreshToken } from './refreshTokens/RefreshToken.entity';

export default async function(server: Express) {
    console.log('Initializing Mongo...')

    const connectionString = getConnectionString()
    console.log('connectionString:', connectionString)

    const orm = await MikroORM.init({
        entities: [
            BaseEntity,
            RefreshToken,
            User,
        ],
        dbName: config.persistence.mongo.databaseName,
        type: 'mongo',
        clientUrl: connectionString,
        metadataProvider: TsMorphMetadataProvider,
    })

    IdentityContext.init(orm)
    
    server.use((_request: Request, _response: Response, next: (...args: any[]) => void) => {
        RequestContext.create(orm.em, next)
    })

    console.log('Mongo initialized!')
}

const connectionStringTemplate = 'mongodb+srv://<user>:<password>@maincluster.gwcad.mongodb.net/<databaseName>?retryWrites=true&w=majority'

function getConnectionString(): string {
    return connectionStringTemplate
        .replace('<user>', config.persistence.mongo.user)
        .replace('<password>', config.persistence.mongo.password)
        .replace('<databaseName>', config.persistence.mongo.databaseName)
}
