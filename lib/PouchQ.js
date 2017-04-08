'use strict';
/*eslint camelcase: ["error", {properties: "never"}]*/

function PouchQ(db) {
  /**
   * Set all instances of key to value in a PouchDB instance.
   * @param {string} key Key to overwrite on each doc.
   * @param {any} value Value to set the key to.
   * @param {PouchDB} [_db] Database to use.
   */
  this.blankDatabase = (key, value, _db) => {
    const database = _db || db;
    return database.allDocs({include_docs: true})
    .then(res => {
      return res.rows.map(row => {
        row['doc'][key] = value;
        return row['doc'];
      });
    })
    .then(docs => {
      database.bulkDocs(docs);
    })
    .catch(e => {
      console.error(e);
    });
  };

  /**
   * Delete all docs in a database (from the index, not from disk).
   * @param {PouchDB} [_db] Database to erase.
   */
  this.deleteDatabase = _db => {
    const database = _db || db;
    return database.allDocs({include_docs: true})
    .then(res => {
      return res.rows.map(row => {
        row['doc']._deleted = true;
        return row['doc'];
      });
    })
    .then(docs => {
      database.bulkDocs(docs);
    })
    .catch(e => {
      console.error(e);
    });
  };

  this.filterAllDocs = res => {
    return res.rows.map(row => row.doc);
  };

  this.postQueryCleanup = docs => {
    return docs.map(doc => {
      delete doc._id;
      delete doc._rev;
      doc.value = +doc.value;
      return doc;
    });
  };

  /**
   * Get or create a doc. Makes the assumption that docs hold values on a
   * key called 'value'.
   * @param {string} id
   * @param {any} defaultValue
   * @param {PouchDB} [_db]
   */
  this.safelyGet = (id, defaultValue, _db) => {
    const database = _db || db;

    return database.get(id)
    .catch(() => {
      return database.put({
        _id: id,
        value: defaultValue
      })
      .then(() => {
        return database.get(id);
      });
    })
    .catch(e => {
      console.error(`Could not get or create ${id} in ${database.name}`);
      console.error(e);
    });
  };
}

module.exports = PouchQ;
