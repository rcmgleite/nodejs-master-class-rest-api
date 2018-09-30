const GET = 'get'
const POST = 'post'
const PUT = 'put'
const DELETE = 'delete'
const NOT_FOUND = '__not_found__'

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
    this._handlers[PUT] = {}
    this._handlers[DELETE] = {}
  }

  registerNotFound(handler) {
    this._handlers[NOT_FOUND] = handler
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
   *  put register a new handler for the PUT HTTP verb
   *
   *  @param {string} route - request route that will trigger the given handler when called
   *  @param {function} handler - handler to be executed when the given route is requested
   */
  put(route, handler) {
    this._handlers[PUT][route] = handler
  }

  /*
   *  delete register a new handler for the DELETE HTTP verb
   *
   *  @param {string} route - request route that will trigger the given handler when called
   *  @param {function} handler - handler to be executed when the given route is requested
   */
  delete(route, handler) {
    this._handlers[DELETE][route] = handler
  }

  /*
   *  handler returns the handler corresponding to the given route and method
   *
   *  @param {string} route - issued route
   *  @param {string} method - GET or POST
   */
  handler(route, method) {
    method = method.toLowerCase()
    if (this._handlers[method] !== undefined && this._handlers[method][route] !== undefined) {
      return this._handlers[method][route]
    }

    return this._handlers[NOT_FOUND] 
  }
}

module.exports = Router
