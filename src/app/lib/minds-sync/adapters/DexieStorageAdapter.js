export default class DexieStorageAdapter {
  /**
   * @param {Dexie} db
   */
  constructor(db) {
    this.db = db;
    this.isReady = false;
  }

  /**
   * @param {Number} versionNumber
   * @param {Object} schema
   */
  schema(versionNumber, schema) {
    const dexieSchema = {};

    for (const tableName of Object.keys(schema)) {
      const table = schema[tableName];
      dexieSchema[tableName] = table.primaryKey || '';

      if (table.indexes && table.indexes.length > 0) {
        dexieSchema[tableName] += `,${table.indexes.join(',')}`;
      }
    }

    this.db.version(versionNumber).stores(dexieSchema);
  }

  /**
   * @returns {Promise<boolean>}
   */
  async ready() {
    if (!this.isReady) {
      await this.db.open();
      this.isReady = true;
    }

    return true;
  }

  /**
   * @param {string} table
   * @param {Object} data
   * @returns {Promise<*>}
   */
  async insert(table, data) {
    return await this.db.table(table).put(data);
  }

  /**
   * @param {string} table
   * @param {string} id
   * @param {Object} changes
   * @returns {Promise<number>}
   */
  async update(table, id, changes) {
    return await this.db.table(table).update(id, changes);
  }

  /**
   * @param {string} table
   * @param {string} id
   * @param {Object} data
   * @param {Object} initialData
   * @returns {Promise<boolean>}
   */
  async upsert(table, id, data, initialData = {}) {
    const updatedRows = await this.db.table(table).update(id, data);

    if (!updatedRows) {
      await this.db.table(table).put(Object.assign(initialData, data));
    }

    return true;
  }

  /**
   * @param {string} table
   * @param {string} key
   * @returns {Promise<void>}
   */
  async delete(table, key) {
    return await this.db.table(table).delete(key);
  }

  /**
   * @param {string} table
   * @returns {Promise<void>}
   */
  async truncate(table) {
    return await this.db.table(table).clear();
  }

  /**
   * @param {String} table
   * @param {*[]} rows
   * @returns {Promise<*>}
   */
  async bulkInsert(table, rows) {
    return await this.db.table(table).bulkPut(rows);
  }

  /**
   * @param {String} table
   * @param {String} field
   * @param {number} value
   * @returns {Dexie.Promise<number>}
   */
  async deleteLessThan(table, field, value) {
    return await this.db.table(table).where(field).below(value).delete();
  }

  /**
   * @param {String} table
   * @param {String} field
   * @param {String|Number} value
   * @returns {Dexie.Promise<number>}
   */
  async deleteEquals(table, field, value) {
    return await this.db.table(table).where(field).equals(value).delete();
  }

  /**
   * @param {String} table
   * @param {String} index
   * @param {*[]} values
   * @returns {Promise<number>}
   */
  async deleteAnyOf(table, index, values) {
    return await this.db.table(table).where(index).anyOf(values).delete();
  }

  /**
   * @param {String} table
   * @param {String} key
   * @returns {Promise<Object>}
   */
  async get(table, key) {
    return await this.db.table(table).get(key);
  }

  /**
   * @param {String} table
   * @param {String} field
   * @param {String|Number} value
   * @param {Object} opts
   * @returns {Promise<Array<*>>}
   */
  async getAllSliced(table, field, value, opts) {
    let collection = this.db.table(table).where(field).equals(value);

    if (opts.offset) {
      collection = collection.offset(opts.offset || 0);
    }

    if (opts.limit) {
      collection = collection.limit(opts.limit);
    }

    return await collection.toArray();
  }

  /**
   * @param {String} table
   * @param {String} field
   * @param {String|Number} value
   * @param {{ sortBy }} opts
   * @returns {Promise<Array<*>>}
   */
  async getAllLessThan(table, field, value, opts = {}) {
    const collection = this.db.table(table).where(field).below(value);

    if (opts.sortBy) {
      return await collection.sortBy(opts.sortBy);
    }

    return await collection.toArray();
  }

  /**
   * @param {string} table
   * @param {{ sortBy }} opts
   * @returns {Promise<*[]>}
   */
  async all(table, opts = {}) {
    const collection = this.db.table(table).toCollection();

    if (opts.sortBy) {
      return await collection.sortBy(opts.sortBy);
    }

    return await collection.toArray();
  }

  /**
   * @param {String} table
   * @param {String} index
   * @param {*[]} values
   * @returns {Promise<*[]>}
   */
  async anyOf(table, index, values) {
    return await this.db.table(table).where(index).anyOf(values).toArray();
  }
}
