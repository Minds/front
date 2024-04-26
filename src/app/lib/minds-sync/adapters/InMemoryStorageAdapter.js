export default class InMemoryStorageAdapter {
  /**
   * @param {Object} db
   */
  constructor(db) {
    db._inMemoryStorage = {
      tables: {},
      data: {},
    };

    this.db = db._inMemoryStorage;
  }

  /**
   * @param {Number} versionNumber
   * @param {Object} schema
   */
  schema(versionNumber, schema) {
    for (const tableName of Object.keys(schema)) {
      this.db.tables[tableName] = schema[tableName];
      this.db.data[tableName] = [];
    }
  }

  /**
   * @param {string} table
   * @returns {string | null}
   * @private
   */
  _getPrimaryKey(table) {
    return this.db.tables[table].primaryKey || null;
  }

  /**
   * @param {string} table
   * @param {string} field
   * @param {*} value
   * @returns {number}
   * @private
   */
  _getIndexBy(table, field, value) {
    return this.db.data[table].findIndex((row) => row[field] === value);
  }

  /**
   * @param {string} table
   * @param {*} value
   * @returns {number}
   * @private
   */
  _getIndexByPrimaryKey(table, value) {
    const primaryKey = this._getPrimaryKey(table);

    if (!primaryKey) {
      return -1;
    }

    return this._getIndexBy(table, primaryKey, value);
  }

  /**
   * @param {string} table
   * @param {Object} row
   * @returns {number}
   * @private
   */
  _getIndexByPrimaryKeyOnRow(table, row) {
    const primaryKey = this._getPrimaryKey(table);

    if (!primaryKey) {
      return -1;
    }

    return this._getIndexBy(table, primaryKey, row[primaryKey]);
  }

  /**
   * @returns {Promise<boolean>}
   */
  async ready() {
    return true;
  }

  /**
   * @param {string} table
   * @param {Object} data
   * @returns {Promise<*>}
   */
  async insert(table, data) {
    const row = Object.assign({}, data);
    const index = this._getIndexByPrimaryKeyOnRow(table, row);

    if (index > -1) {
      this.db.data[table][index] = row;
    } else {
      this.db.data[table].push(row);
    }

    return true;
  }

  /**
   * @param {string} table
   * @param {string} id
   * @param {Object} changes
   * @returns {Promise<number>}
   */
  async update(table, id, changes) {
    const index = this._getIndexByPrimaryKey(table, id);

    if (index > -1) {
      this.db.data[table][index] = Object.assign(
        this.db.data[table][index],
        changes
      );
      return 1;
    }

    return 0;
  }

  /**
   * @param {string} table
   * @param {string} id
   * @param {Object} data
   * @param {Object} initialData
   * @returns {Promise<boolean>}
   */
  async upsert(table, id, data, initialData = {}) {
    const updatedRows = await this.update(table, id, data);

    if (!updatedRows) {
      await this.insert(table, Object.assign(initialData, data));
    }

    return true;
  }

  /**
   * @param {string} table
   * @param {string} key
   * @returns {Promise<void>}
   */
  async delete(table, key) {
    const index = this._getIndexByPrimaryKey(table, key);

    if (index > -1) {
      this.db.data[table].splice(index, 1);
    }
  }

  /**
   * @param {string} table
   * @returns {Promise<void>}
   */
  async truncate(table) {
    this.db.data[table] = [];
  }

  /**
   * @param {String} table
   * @param {*[]} rows
   * @returns {Promise<*>}
   */
  async bulkInsert(table, rows) {
    for (const row of rows) {
      await this.insert(table, row);
    }

    return true;
  }

  /**
   * @param {String} table
   * @param {String} field
   * @param {number} value
   * @returns {Promise<number>}
   */
  async deleteLessThan(table, field, value) {
    const currentSize = this.db.data[table].length;

    this.db.data[table] = this.db.data[table].filter(
      (row) => row[field] >= value
    );

    return currentSize - this.db.data[table].length;
  }

  /**
   * @param {String} table
   * @param {String} field
   * @param {String|Number} value
   * @returns {Promise<number>}
   */
  async deleteEquals(table, field, value) {
    const currentSize = this.db.data[table].length;

    this.db.data[table] = this.db.data[table].filter(
      (row) => row[field] !== value
    );

    return currentSize - this.db.data[table].length;
  }

  /**
   * @param {String} table
   * @param {String} index
   * @param {*[]} values
   * @returns {Promise<number>}
   */
  async deleteAnyOf(table, index, values) {
    const currentSize = this.db.data[table].length;

    this.db.data[table] = this.db.data[table].filter(
      (row) => values.indexOf(row[index]) === -1
    );

    return currentSize - this.db.data[table].length;
  }

  /**
   * @param {String} table
   * @param {String} key
   * @returns {Promise<Object>}
   */
  async get(table, key) {
    const index = this._getIndexByPrimaryKey(table, key);

    if (index === -1) {
      return null;
    }

    return Object.assign({}, this.db.data[table][index]);
  }

  /**
   * @param {String} table
   * @param {String} field
   * @param {String|Number} value
   * @param {Object} opts
   * @returns {Promise<Array<*>>}
   */
  async getAllSliced(table, field, value, opts) {
    let collection = this.db.data[table].filter((row) => row[field] === value);

    if (opts.offset && opts.limit) {
      collection = collection.slice(opts.offset, opts.offset + opts.limit);
    } else if (opts.limit) {
      collection = collection.slice(0, opts.limit);
    } else if (opts.offset) {
      collection = collection.slice(opts.offset);
    }

    return collection.map((row) => Object.assign({}, row));
  }

  /**
   * @param {String} table
   * @param {String} field
   * @param {String|Number} value
   * @param {{ sortBy }} opts
   * @returns {Promise<Array<*>>}
   */
  async getAllLessThan(table, field, value, opts = {}) {
    const collection = this.db.data[table]
      .filter((row) => row[field] < value)
      .map((row) => Object.assign({}, row));

    if (opts.sortBy) {
      return collection.sort((a, b) => {
        const aIndex = a[opts.sortBy];
        const bIndex = b[opts.sortBy];

        if (aIndex < bIndex) return -1;
        else if (bIndex > aIndex) return -1;

        return 0;
      });
    }

    return collection;
  }

  /**
   * @param {string} table
   * @param {{ sortBy }} opts
   * @returns {Promise<*[]>}
   */
  async all(table, opts = {}) {
    const collection = this.db.data[table].map((row) => Object.assign({}, row));

    if (opts.sortBy) {
      return collection.sort((a, b) => {
        const aIndex = a[opts.sortBy];
        const bIndex = b[opts.sortBy];

        if (aIndex < bIndex) return -1;
        else if (bIndex > aIndex) return -1;

        return 0;
      });
    }

    return collection;
  }

  /**
   * @param {String} table
   * @param {String} index
   * @param {*[]} values
   * @returns {Promise<*[]>}
   */
  async anyOf(table, index, values) {
    return this.db.data[table]
      .filter((row) => values.indexOf(row[index]) > -1)
      .map((row) => Object.assign({}, row));
  }
}
