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
    this.route = this.route.bind(this)
    this.listen = this.listen.bind(this)
  }

  /*
   *  route is the method responsible for routing the received request to
   *   the appropriate handler
   */
  route(req, res) {
    const parsedURL = url.parse(req.url, true)
    const route = parsedURL.pathname.replace(/^\/+|\/+$/g, '')

    const queryString = parsedURL.query
    const headers = req.headers
    const decoder = new StringDecoder('utf-8')

    let buffer = ''
    req.on('data', (data) => {
      buffer += decoder.write(data)
    })

    req.on('end', async () => {
      try {
        buffer += decoder.end()
        const request = new Request({ 
          route: route,
          queryString: queryString,
          method: req.method,
          headers, headers,
          payload: buffer
        })

        let handler = this._router.handler(route, req.method)
          const response = await handler(request)
          let statusCode = response.StatusCode()
          let payload = response.Payload()

          statusCode = typeof(statusCode) == 'number' ? statusCode : 200
          payload = typeof(payload) == 'object' ? payload : {}
          
          res.setHeader('Content-Type', 'application/json')
          res.writeHead(statusCode)
          res.end(JSON.stringify(payload))
      } catch (err) {
        console.dir(err)
        res.writeHead(500)
        res.end(JSON.stringify({
          err: err,
          msg: 'internal server error'
        }))
      }
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
    this._server = http.createServer(this.route)
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

    this._server = https.createServer(httpsOpts, this.route)
  }
}

class Request {
  constructor(args) {
    this._route = args.route
    this._queryString = args.queryString
    this._method = args.method
    this._headers = args.headers
    this._payload = JSON.parse(args.payload || '{}')
  }

  route() { return this._route }
  queryString() { return this._queryString }
  method() { return this._method }
  headers() { return this._headers }
  payload() { return this._payload }
}

class Response {
  constructor(args) { 
    this._statusCode = args.statusCode
    this._payload = args.payload
  }

  StatusCode() {
    return this._statusCode
  }

  Payload() {
    return this._payload
  }
}

module.exports = {
  HttpServer,
  HttpsServer,
  Request,
  Response
}
