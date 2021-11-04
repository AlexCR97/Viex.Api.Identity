import config from '@/config.json'
import initApi from '@/api'
import initPersistence from '@/persistence'
import initErrorHandlerMiddleware from '@/api/middleware/ErrorHandler.middleware'

async function main() {
    console.log('Starting application...')
    console.log('Config:', config)

    const app = await initApi()
    await initPersistence(app)
    await initErrorHandlerMiddleware(app)

    console.log('Application started!')

    app.listen(config.api.port, () => {
        console.log(`Server listening in port ${config.api.port}`)
    })
}

main().catch(err => {
    console.log("Unhandled error:", err)
})
