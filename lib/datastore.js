const fs = require('fs')
const path = require('path')

/*
 * Datastore implements a simple k-v
 * store on fs.
 */
class Datastore {
  constructor(datadir) { 
    this._datadir = datadir

    this.store = this.store.bind(this)
  }

  store(namespace, fname, data, callback) {
    const pathparts = [this._datadir, namespace, fname]
    
    fs.open(pathparts.join('/'), 'wx', (err, fd) => {
      if (err || !fd) {
        return callback('Unable to create new file')
      }

      fs.writeFile(fd, JSON.stringify(data), (err) => {
        // TODO
      })
    }) 
  }
}

module.exports = Datastore
