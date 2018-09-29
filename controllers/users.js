const Server = require('../server')
const lib = require('../lib')
const utils = require('../utils')
// FIXME - pass datastore as controller method parameter
const datastore = new lib.Datastore('./.data')

/*
 *  playerExists returns true if a player with the given phone is already stored
 *
 *  @param phone {string} - phone number used as primary key for users
 */
async function playerExists(phone) {
  try {
    await datastore.read('users', phone)
    return true
  } catch(err) {
    if (err.errno == -2) { // ENOENT
      return false
    }

    throw err
  }
}

/*
 * create creates a new player and store it on disk
 * If a user with the given phone already exists, this controller returns 400
 * to the client.
 * If any error occur, this controller returns 500 to the client
 * Otherwise, return 200
 *
 * TODO: validate user input
 */
async function create(request) {
  const payload = request.payload()
  try {
    const exists = await playerExists(payload.phone)
    if (exists) {
      return new Server.Response({
        statusCode: 400,
        payload: {
          msg: 'user with phone number already exists'
        }
      })    
    }

    payload.salt = 'whatasalt' // TODO generate random salt
    payload.password = utils.hash(`${payload.password}${payload.salt}`)
    await datastore.upsert('users', payload.phone, payload)
    return new Server.Response({
      statusCode: 200,
    })
  } catch(err) {
    console.dir(err)
    return new Server.Response({
      statusCode: 500,
      payload: {
        msg: `Failed to save user`,
        err: err,
      }
    })
  }
}

module.exports = {
  create
}
