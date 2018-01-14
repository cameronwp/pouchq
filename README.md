# PouchQ

Simplified interactions with PouchDB. These were developed for a specific project but have *mostly* been generalized for usage elsewhere.

```sh
npm i -S pouchq
```

## Usage

You'll need to [install and create a PouchDB database](https://www.npmjs.com/package/pouchdb) first. For example:

```sh
npm i pouchdb
```

```js
// script.js
const PouchDB = require('pouchdb');
const db = new PouchDB('my_db');
```

This library simplifies managing large changes with a database. Everything returns a `Promise`. Examples assume availability of `await` and `async`.

```js
// script.js
const PouchDB = require('pouchdb');
const PouchQ = require('pouchq');

const db = new PouchDB('my_db');
const pq = PouchQ(db); // you can overwrite db in some commands
```

**Set all instances of key to value.**

```js
pq.blankDatabase(key, value, [optionalDB]);
```

**Get or create a doc. Makes the assumption that docs hold values on a key called `value`.**

```js
const doc = await pq.safelyGet(id, defaultValue, [optionalDB])
```

**Delete all docs in a database (from the index, not from disk).**

```js
pq.deleteDatabase([optionalDB]);
```

**Get docs from a response.**

```js
const docs = await db.allDocs({include_docs: true}).then(pq.filterAllDocs);
```

**Remove `._id`, `._rev` from docs. Also makes sure `.value` is a number (which is probably too specific for most projects).**

```js
const docs = await db.allDocs({include_docs: true}).then(pq.filterAllDocs).then(pq.postQueryCleanup);
```
