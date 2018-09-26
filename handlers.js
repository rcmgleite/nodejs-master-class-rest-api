/*
 * This file contains all API handlers.
 */

function ping(data, callback) {
  return callback(200)
}

function hello(data, callback) {
  return callback(200, {
    msg: 'Hello!'
  })
}

module.exports = {
  ping,
  hello
}
