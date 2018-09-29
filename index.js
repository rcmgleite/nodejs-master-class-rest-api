/*
 *  API entry point
 */
const Server = require('./server')
const config = require('./config')
const Router = require('./router')
const defaultController = require('./controllers/default')
const usersController = require('./controllers/users')

// Create a new router and register all routes
const router = new Router()

// default routes
router.registerNotFound(defaultController.notFound)
router.get('ping', defaultController.ping)
router.get('hello', defaultController.hello)
router.post('somethingAsync', defaultController.somethingAsync)

// users routes
router.post('user', usersController.create)

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
