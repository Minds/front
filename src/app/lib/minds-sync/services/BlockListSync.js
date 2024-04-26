export default class BlockListSync {
  /**
   * @param {MindsClientHttpAdapter|MindsMobileClientHttpAdapter} http
   * @param {DexieStorageAdapter|InMemoryStorageAdapter|SqliteStorageAdapter} db
   */
  constructor(http, db) {
    this.http = http;
    this.db = db;
  }

  /**
   * @returns {boolean}
   */
  setUp() {
    this.db.schema(1, {
      users: {
        primaryKey: 'guid',
      },
    });

    return true;
  }

  /**
   * @returns {Promise<boolean>}
   */
  async sync() {
    await this.db.ready();

    try {
      const response = await this.http.get(`api/v1/block`, {
        sync: 1,
        limit: 10000,
      });

      if (!response || !response.guids) {
        throw new Error('Invalid server response');
      }

      await this.prune();

      const users = response.guids.map((guid) => ({ guid }));

      await this.db.bulkInsert('users', users);
    } catch (e) {
      console.warn(e);
      return false;
    }

    return true;
  }

  /**
   * @returns {Promise<*[]>}
   */
  async getList() {
    await this.db.ready();
    return (await this.db.all('users')).map((row) => row.guid);
  }

  /**
   * @param guid
   * @returns {Promise<any>}
   */
  async add(guid) {
    await this.db.ready();
    return await this.db.insert('users', { guid });
  }

  /**
   * @param guid
   * @returns {Promise<void>}
   */
  async remove(guid) {
    await this.db.ready();
    return await this.db.delete('users', guid);
  }

  /**
   * @returns {Promise<void>}
   */
  async prune() {
    await this.db.ready();
    return await this.db.truncate('users');
  }
}
