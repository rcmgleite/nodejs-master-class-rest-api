const utils = require('../utils')

/*
 * Users model. Currently it only validates the construction arguments
 * and provides getters and setters for each property
 *
 * FIXME - the validation could be extracted to a library
 */
class User {
  constructor(args) {
    this.firstName = args.firstName || args._firstName
    this.lastName = args.lastName || args._lastName
    this.phone = args.phone || args._phone
    this.salt = args.salt || args._salt
    this.password = args.password || args._password
    this.tosAgreement = args.tosAgreement || args._tosAgreement
  }

  set firstName(firstName) {
    if (typeof(firstName) !== 'string' || firstName.length <= 0) {
      throw new Error(`firstName must be non empty string. Got ${firstName}`)
    }

    this._firstName = firstName
  }

  get firstName() {
    return this._firstName
  }

  set lastName(lastName) {
    if (typeof(lastName) !== 'string' || lastName.length <= 0) {
      throw new Error(`lastName must be non empty string. Got ${lastName}`)
    }

    this._lastName = lastName
  }

  get lastName() {
    return this._lastName
  }

  set phone(phone) {
    if (typeof(phone) !== 'string' || phone.length <= 0) {
      throw new Error(`phone must be non empty string. Got ${phone}`)
    }

    this._phone = phone
  }

  get phone() {
    return this._phone
  }

  set password(password) {
    if (typeof(password) !== 'string' || password.length <= 0) {
      throw new Error(`password must be non empty string`)
    }

    if (this._salt !== undefined) {
      this._password = password
      return
    } 

    const salt = 'whatasalt' // TODO generate random salt
    const hashedPassword = utils.hash(`${password}${salt}`)
    this.salt = salt
    this._password = hashedPassword
  }

  get password() {
    return this._password
  }

  set salt(salt) {
    this._salt = salt
  }

  get salt() {
    return this._salt
  }

  set tosAgreement(ta) {
    if (typeof(ta) !== 'boolean') {
      throw new Error(`tosAgreement must be a boolean. Got '${typeof(ta)}'`)
    }
    this._tosAgreement = ta
  }

  get tosAgreement() {
    return this._tosAgreement
  }
}

module.exports = User
