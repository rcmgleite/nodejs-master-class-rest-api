/*
 *  API entry point
 */
const Server = require('./server')
const config = require('./config')
const Router = require('./router')
const handlers = require('./handlers')

// Create a new router and register all routes
const router = new Router()
router.get('ping', handlers.ping)
router.get('hello', handlers.hello)
router.post('somethingAsync', handlers.somethingAsync)

// Create the servers
const httpServer = new Server.HttpServer(router)
const httpsServer = new Server.HttpsServer(router, './ssl/key.pem', './ssl/cert.pem')

// Start servers
const serverConfig = config.serverConfig
httpServer.listen(serverConfig.httpPort, () => {
  console.log(`Server listening on port ${serverConfig.httpPort}`)
})

httpsServer.listen(serverConfig.httpsPort, () => {
  console.log(`Server listening on port ${serverConfig.httpsPort}`)
})
