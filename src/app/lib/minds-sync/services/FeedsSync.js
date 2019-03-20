const E_NO_RESOLVER = function () {
  throw new Error('Resolver not set')
};

export default class FeedsSync {
  /**
   * @param {MindsClientHttpAdapter|MindsMobileClientHttpAdapter} http
   * @param {DexieStorageAdapter|SqliteStorageAdapter} db
   * @param {Number} stale_after
   * @param {Number} limit
   */
  constructor(http, db, stale_after, limit) {
    this.http = http;
    this.db = db;
    this.stale_after_ms = stale_after * 1000;
    this.limit = limit;

    this.resolvers = {
      stringHash: E_NO_RESOLVER,
      currentUser: E_NO_RESOLVER,
      blockedUserGuids: E_NO_RESOLVER,
      fetchEntities: E_NO_RESOLVER,
      prefetchEntities: E_NO_RESOLVER,
    }
  }

  /**
   * @returns {boolean}
   */
  setUp() {
    this.db.schema(2, {
      feeds: {
        primaryKey: 'id',
        indexes: ['*key'],
      },
      syncAt: {
        primaryKey: 'key',
        indexes: ['sync'],
      },
    });

    return true;
  }

  /**
   * @param {Object} resolvers
   * @returns {FeedsSync}
   */
  setResolvers(resolvers) {
    this.resolvers = Object.assign(this.resolvers, resolvers);
    return this;
  }

  /**
   * @param {Object} opts
   * @returns {Promise<{next: Number, entities: *[]}>}
   */
  async get(opts) {
    await this.db.ready();

    const key = await this.buildKey(opts);

    // If it's the first page or a forced refresh is needed, attempt to sync

    if (!opts.offset || opts.forceSync) {
      const wasSynced = await this.sync(opts);

      if (!wasSynced) {
        console.info('Cannot sync, using cache');
      }
    }

    // Fetch

    try {
      const rows = await this.db.getAllSliced('feeds', 'key', key, {
        offset: opts.offset,
        limit: opts.limit,
      });

      let next;
      if (rows.length > 0) {
        next = (opts.offset || 0) + opts.limit;
      }

      // Hydrate entities

      const entities = await this.resolvers.fetchEntities(rows.map(row => row.guid));

      // Prefetch

      this.prefetch(opts, next);

      //

      return {
        entities,
        next,
      }
    } catch (e) {
      console.error('FeedsSync.get', e);
      throw e;
    }
  }

  /**
   * @param {Object} opts
   * @param {Number} futureOffset
   * @returns {Promise<boolean>}
   */
  async prefetch(opts, futureOffset) {
    if (!futureOffset) {
      return false;
    }

    const key = await this.buildKey(opts);

    const rows = await this.db.getAllSliced('feeds', 'key', key, {
      offset: futureOffset,
      limit: opts.limit,
    });

    await this.resolvers.prefetchEntities(rows.map(row => row.guid));

    return true;
  }

  /**
   * @param {Object} opts
   * @returns {Promise<boolean>}
   */
  async sync(opts) {
    await this.db.ready();

    const key = await this.buildKey(opts);

    // Is sync needed?

    if (!opts.forceSync) {
      const lastSync = await this.db.get('syncAt', key);

      if (lastSync && lastSync.sync && (lastSync.sync + this.stale_after_ms) >= Date.now()) {
        return true;
      }
    }

    // Sync

    try {
      const response = await this.http.get(`api/v2/feeds/global/${opts.algorithm}/${opts.customType}`, {
        sync: 1,
        limit: this.limit,
        container_guid: opts.container_guid || '',
        period: opts.period || '',
        hashtags: opts.hashtags || '',
        all: opts.all ? 1 : '',
        query: opts.query || '',
        nsfw: opts.nsfw || '',
      }, true);

      if (!response.entities || typeof response.entities.length === 'undefined') {
        throw new Error('Invalid server response');
      }

      // Prune old list

      await this.prune(key);

      // Read blocked list

      const blockedList = await this.resolvers.blockedUserGuids();

      // Setup rows

      const entities = response.entities
        .filter(feedSyncEntity => blockedList.indexOf(feedSyncEntity.owner_guid) === -1)
        .map((feedSyncEntity, index) => {
          let obj = {
            key,
              id: `${key}:${`${index}`.padStart(24, '0')}`,
          };

          obj = Object.assign(obj, feedSyncEntity);

          return obj;
        });

      // Insert onto DB

      await this.db.bulkInsert('feeds', entities);
      await this.db.insert('syncAt', { key, sync: Date.now() });
    } catch (e) {
      console.warn('FeedsSync.sync', e);
      return false;
    }

    return true;
  }

  /**
   * @param {String} key
   * @returns {Promise<boolean>}
   */
  async prune(key) {
    try {
      await this.db
        .deleteEquals('feeds', 'key', key);

      await this.db
        .delete('syncAt', key);

      return true;
    } catch (e) {
      console.error('FeedsSync.prune', e);
      throw e;
    }
  }

  /**
   * @returns {Promise<boolean>}
   */
  async destroy() {
    try {
      await Promise.all([
        this.db.truncate('feeds'),
        this.db.truncate('syncAt'),
      ]);

      return true;
    } catch (e) {
      console.error('FeedsSync.prune', e);
      throw e;
    }
  }

  /**
   * @param {Object} opts
   * @returns {Promise<String>}
   */
  async buildKey(opts) {
    const userGuid = await this.resolvers.currentUser();

    return await this.resolvers.stringHash(JSON.stringify([
      userGuid,
      opts.container_guid || '',
      opts.algorithm || '',
      opts.customType || '',
      opts.period || '',
      opts.hashtags || '',
      Boolean(opts.all),
      opts.query || '',
      opts.nsfw || '',
    ]));
  }

  /**
   * @returns {Promise<boolean>}
   */
  async gc() {
    const maxTimestamp = Date.now() - (this.stale_after_ms * 10);

    await Promise.all(
      (await this.db.getAllLesserThan('syncAt', 'sync', maxTimestamp))
        .map(row => this.prune(row.key))
    );

    return true;
  }
}
