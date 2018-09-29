const Server = require('../server')
const lib = require('../lib')
// FIXME - pass datastore as controller method parameter
const User = require('../models/user')
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
 */
async function create(request) {
  try {
    const user = new User(request.payload())
    const exists = await playerExists(user.phone)
    if (exists) {
      return new Server.Response({
        statusCode: 400,
        payload: {
          msg: 'user with phone number already exists'
        }
      })    
    }

    await datastore.upsert('users', user.phone, user)
    return new Server.Response({
      statusCode: 200,
    })
  } catch(err) {
    console.dir(err)
    return new Server.Response({
      statusCode: 500,
      payload: {
        msg: `Failed to save user`,
        err: `${err.name} - ${err.message}`,
      }
    })
  }
}

module.exports = {
  create
}
