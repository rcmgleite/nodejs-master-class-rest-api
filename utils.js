const crypto = require('crypto')

/*
 * hash returns a hash of the given string using sha1
 *
 * @param str {string} - string to be hashed
 */
function hash(str) {
  const shasum = crypto.createHash('sha1')
  shasum.update(str)
  return shasum.digest('hex')
}

module.exports = {
  hash,
}
