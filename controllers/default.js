const Server = require('../server')

/*
 *  notFound is called when the client tries to access a path that do not exist
 */
async function notFound(request) {
  return new Server.Response({
    statusCode: 404,
    payload: {msg: `can not ${request.method()} on ${request.route()}`}
  })
}

/*
 *  Simple ping handler
 */
async function ping(request) {
  return new Server.Response({
    statusCode: 200,
  })
}

/*
 * hello responds a HTTP request with 200 and with a simple payload 
 */
async function hello(request) {
  return new Server.Response({
    statusCode: 200,
    payload: {
      msg: 'hi'
    }
  })
}

/*
 *  simple example of an async handler
 */
async function somethingAsync(request) {
  return new Promise((resolve) => {
    const sleepFor = request.payload().sleepFor || 1000
    setTimeout(() => {
      return resolve(new Server.Response({
        statusCode: 200,
        payload: {
          msg: `slept for ${sleepFor} ms`
        }
      }))
    }, sleepFor) 
  })
}

module.exports = {
  notFound,
  ping,
  hello,
  somethingAsync
}
