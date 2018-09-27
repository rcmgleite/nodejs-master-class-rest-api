const fs = require('fs')
const util = require('util')
const fsOpen = util.promisify(fs.open)
const fsClose = util.promisify(fs.close)
const fsWriteFile = util.promisify(fs.writeFile)

/*
 * Datastore implements a simple k-v
 * store on fs.
 */
class Datastore {
  constructor(datadir) { 
    this._datadir = datadir
    this.create = this.create.bind(this)
  }

  /*
   *  create creates a new file within the given namespace(dir)
   *  It returns an error if something goes wrong
   *
   *  @param namespace {string} - namespace is like a database in a relational model. In our case
   *    it represents a directory where all files (aka tables) will be written to
   *  @param namespace {string} - fname is equivalent to the table name on a relational model
   *  @param data {object} - data to be persisted on disk
   */
  async create(namespace, fname, data) {
    try {
      const filepath = [this._datadir, namespace, `${fname}.json`].join('/')
      const fd = await fsOpen(filepath, 'wx')
      // FIXME - resource leak if JSON.stringify throws
      await fsWriteFile(fd, JSON.stringify(data))
      await fsClose(fd)
    } catch(err) {
      console.dir(err) 
      return err
    }
  }
}

module.exports = Datastore
