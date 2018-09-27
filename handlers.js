/*
 * This file contains all API handlers.
 * The handlers must return a promise.
 * Also, they only receive one parameter of type ServerRequest.
 */
const Server = require('./server')

async function ping(request) {
  return new Server.Response({
    statusCode: 200,
  })
}

async function hello(request) {
  return new Server.Response({
    statusCode: 200,
  })
}

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
  ping,
  hello,
  somethingAsync
}
