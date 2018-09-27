const GET = 'get'
const POST = 'post'
const NOT_FOUND = '__not_found__'
const NOT_IMPLEMENTED = '__not_implemented__'

/**
  * Router is the class responsible for storing all API routes.
  */
class Router {
  constructor() { 
    this.get = this.get.bind(this)
    this.post = this.post.bind(this)
    this.handler = this.handler.bind(this)

    this._handlers = { }
    this._handlers[GET] = {}
    this._handlers[POST] = {}
  }

  registerNotFound(handler) {
    this._handlers[NOT_FOUND] = handler
  }

  registerNotImplemented(handler) {
    this._handlers[NOT_IMPLEMENTED] = handler 
  }

  /*
   *  get register a new handler for the GET HTTP verb
   *
   *  @param {string} route - request route that will trigger the given handler when called
   *  @param {function} handler - handler to be executed when the given route is requested
   */
  get(route, handler) {
    this._handlers[GET][route] = handler
  }

  /*
   *  post register a new handler for the POST HTTP verb
   *
   *  @param {string} route - request route that will trigger the given handler when called
   *  @param {function} handler - handler to be executed when the given route is requested
   */
  post(route, handler) {
    this._handlers[POST][route] = handler
  }

  /*
   *  handler returns the handler corresponding to the given route and method
   *
   *  @param {string} route - issued route
   *  @param {string} method - GET or POST
   */
  handler(route, method) {
    method = method.toLowerCase()
    if (this._handlers[method] === undefined) {
      return this._handlers[NOT_IMPLEMENTED]
    }

    let h = this._handlers[method][route]
    if (h === undefined) {
      console.log(`not found: ${route}`)
      h = this._handlers[NOT_FOUND]
    }

    return h
  }
}

module.exports = Router
