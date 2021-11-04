import { Express } from 'express'
import initMongo from '@/persistence/mongo'

export default async function(server: Express) {
    await initMongo(server)
}
