const fs = require('fs')
const util = require('util')
const fsWriteFile = util.promisify(fs.writeFile)
const fsReadFile = util.promisify(fs.readFile)
const fsUnlink = util.promisify(fs.unlink)

/*
 * Datastore implements a simple k-v
 * store on fs.
 */
class Datastore {
  constructor(datadir) { 
    this._datadir = datadir
    this.upsert = this.upsert.bind(this)
  }

  /*
   *  upsert creates/updates a file within the given namespace(dir)
   *  It returns an error if something goes wrong
   *
   *  @param namespace {string} - namespace is like a database in a relational model. In our case
   *    it represents a directory where all files (aka tables) will be written to
   *  @param fname {string} - fname is equivalent to the table name on a relational model
   *  @param data {object} - data to be persisted on disk
   */
  async upsert(namespace, fname, data) {
    const dataStr = JSON.stringify(data)
    const filepath = this.filepath(namespace, fname)
    await fsWriteFile(filepath, dataStr)
  }

  /*
   *  read reads the content of the file constructed by namespace + fname parameters
   *
   *  @param namespace {string} - namespace is like a database in a relational model. In our case
   *    it represents a directory where all files (aka tables) will be written to
   *  @param fname {string} - fname is equivalent to the table name on a relational model
   */
  async read(namespace, fname) {
    const filepath = this.filepath(namespace, fname)
    const strData = await fsReadFile(filepath)
    return JSON.parse(strData)
  }

  /*
   *  delete deletes a file with path constructed using the namespace and fname parameters
   *
   *  @param namespace {string} - namespace is like a database in a relational model. In our case
   *    it represents a directory where all files (aka tables) will be written to
   *  @param fname {string} - fname is equivalent to the table name on a relational model
   */
  async delete(namespace, fname) {
    const filepath = this.filepath(namespace, fname)
    await fsUnlink(filepath)
  }

  filepath(namespace, fname) {
    return [this._datadir, namespace, `${fname}.json`].join('/')
  }
}

module.exports = Datastore
