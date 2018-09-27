const Server = require('./server')

module.exports = { 
  __not_found__: async (request) => {
    return new Server.Response({
      statusCode: 404,
      payload: {msg: `can not ${request.method()} on ${request.route()}`}
    })
  },
  __not_implemented__: async (request) => {
    return new Server.Response({
      statusCode: 501,
      payload: {msg: `${request.method()} not implemented`}
    })
  }
}
