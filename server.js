const http = require('http')
const https = require('https')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const fs = require('fs')

/*
 * Server is the base implementation for both HTTP and HTTPS servers
 */
class Server {

  /*
   * @param {Router} router - is an instance of './router.js/Router' class 
   */
  constructor(router) {
    this._router = router
    this.defaultHandler = this.defaultHandler.bind(this)
    this.listen = this.listen.bind(this)
  }

  defaultHandler(req, res) {
    const parsedURL = url.parse(req.url, true)
    const route = parsedURL.pathname.replace(/^\/+|\/+$/g, '')

    const queryString = parsedURL.query
    const headers = req.headers
    const decoder = new StringDecoder('utf-8')

    let buffer = ''
    req.on('data', (data) => {
      buffer += decoder.write(data)
    })

    req.on('end', () => {
      buffer += decoder.end()

      const data = { 
        route: route,
        queryString: queryString,
        method: req.method,
        headers, headers,
        payload: buffer
      }

      let handler = this._router.handler(route, req.method)
      return handler(data, (statusCode, payload) => {
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200
        payload = typeof(payload) == 'object' ? payload : {}
        
        res.setHeader('Content-Type', 'application/json')
        res.writeHead(statusCode)
        res.end(JSON.stringify(payload))
      })
    })
  }

  listen (port, callback) {
    this._server.listen(port, callback)
  }
}

/*
 * HttpServer is a wrapper around http.Server from the default nodejs implementation
 */
class HttpServer extends Server {
  constructor(router) {
    super(router)
    this._server = http.createServer(this.defaultHandler)
  }
}

/*
 * HttpsServer is a wrapper around https.Server from the default nodejs implementation
 */
class HttpsServer extends Server{
  constructor(router, httpsKeyPath, httpsCertPath) {
    super(router)
    const httpsOpts = {
      key: fs.readFileSync(httpsKeyPath),
      cert: fs.readFileSync(httpsCertPath),
    }

    this._server = https.createServer(httpsOpts, this.defaultHandler)
  }
}

module.exports = {
  HttpServer,
  HttpsServer
}
