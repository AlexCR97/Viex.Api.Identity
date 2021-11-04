import express from 'express'
import initControllers from './controllers'

export default async function() {
    console.log('Initializing api layer...')

    const app = express()

    initControllers(app)

    console.log('Initialized api layer!')

    return app
}