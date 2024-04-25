import asyncSleep from '../../../helpers/async-sleep';

const E_NO_RESOLVER = function () {
  throw new Error('Resolver not set');
};

export default class FeedsSync {
  /**
   * @param {MindsClientHttpAdapter|MindsMobileClientHttpAdapter} http
   * @param {DexieStorageAdapter|InMemoryStorageAdapter|SqliteStorageAdapter} db
   * @param {Number} stale_after
   * @param {Number} limit
   */
  constructor(http, db, stale_after, limit) {
    this.http = http;
    this.db = db;
    this.stale_after_ms = stale_after * 1000;

    this.resolvers = {
      stringHash: E_NO_RESOLVER,
      currentUser: E_NO_RESOLVER,
      blockedUserGuids: E_NO_RESOLVER,
      fetchEntities: E_NO_RESOLVER,
    };
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

    // Fetch

    try {
      let entities;
      let next;
      let attempts = 0;

      while (true) {
        try {
          const wasSynced = await this._sync(key, opts);

          if (!wasSynced) {
            console.info('Sync not needed, using cache');
          }
        } catch (e) {
          console.warn('Cannot sync, using cache');
        }

        const rows = await this.db.getAllSliced('feeds', 'key', key, {
          offset: opts.offset,
          limit: opts.limit,
        });

        if (!rows || !rows.length) {
          break;
        }

        // Hydrate entities
        entities = await this.resolvers.fetchEntities(
          rows.map((row) => row.guid)
        );

        // Calculate offset
        opts.offset = (opts.offset || 0) + opts.limit;
        next = opts.offset;

        if (entities && entities.length) {
          break;
        }

        if (attempts++ > 15) {
          break;
        }

        await asyncSleep(100); // Throttle a bit
      }

      //

      return {
        entities,
        next,
      };
    } catch (e) {
      console.error('FeedsSync.get', e);
      throw e;
    }
  }

  /**
   * @param key
   * @param opts
   * @returns {Promise<boolean>}
   * @private
   */
  async _sync(key, opts) {
    await this.db.ready();

    // Read row (if no refresh is needed), else load defaults

    const _syncAtRow = await this.db.get('syncAt', key);

    const syncAt =
      opts.offset && _syncAtRow
        ? _syncAtRow
        : {
            rows: 0,
            moreData: true,
            next: '',
          };

    if (!opts.offset) {
      // Check if first-page sync is needed
      const stale =
        !syncAt.sync || syncAt.sync + this.stale_after_ms < Date.now();

      if (!stale && !opts.forceSync) {
        return false;
      }
    } else if (
      opts.timebased &&
      (!syncAt.moreData || syncAt.rows >= opts.offset + opts.limit)
    ) {
      // Check if non-first-page sync is needed
      return false;
    } else if (!opts.timebased && opts.offset) {
      // If non-first-page and not timebased, sync is not needed
      return false;
    }

    // Request

    try {
      // Setup parameters

      const syncPageSize = Math.max(opts.syncPageSize || 10000, opts.limit);
      const qs = ['sync=1', `limit=${syncPageSize}`];

      if (syncAt.next) {
        qs.push(`from_timestamp=${syncAt.next}`);
      }

      // Setup endpoint (with parameters)

      const endpoint = `${opts.endpoint}${opts.endpoint.indexOf('?') > -1 ? '&' : '?'}${qs.join('&')}`;

      // Perform request

      const response = await this.http.get(endpoint, null, true);

      // Check if valid response

      if (
        !response.entities ||
        typeof response.entities.length === 'undefined'
      ) {
        throw new Error('Invalid server response');
      }

      // Check if offset response

      const next = opts.timebased && response['load-next'];

      // Prune list, if necessary

      if (!syncAt.next) {
        await this.prune(key);
      }

      // Read blocked list

      const blockedList = await this.resolvers.blockedUserGuids();

      // Setup rows

      const entities = response.entities
        .filter((feedSyncEntity) => Boolean(feedSyncEntity))
        .filter(
          (feedSyncEntity) =>
            blockedList.indexOf(feedSyncEntity.owner_guid) === -1
        )
        .map((feedSyncEntity, index) =>
          Object.assign(feedSyncEntity, {
            key,
            id: `${key}:${`${syncAt.rows + index}`.padStart(24, '0')}`,
          })
        );

      // Insert entity refs

      await this.db.bulkInsert('feeds', entities);

      // Update syncAt

      await this.db.upsert('syncAt', key, {
        key,
        rows: syncAt.rows + entities.length,
        moreData: Boolean(next && entities.length),
        next: next || '',
        sync: Date.now(),
      });
    } catch (e) {
      console.warn('FeedsSync.sync', e);
      throw e;
    }

    return true;
  }

  /**
   * @param {String} key
   * @returns {Promise<boolean>}
   */
  async prune(key) {
    try {
      await this.db.deleteEquals('feeds', 'key', key);

      await this.db.delete('syncAt', key);

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

    return await this.resolvers.stringHash(
      JSON.stringify([userGuid, opts.endpoint])
    );
  }

  /**
   * @returns {Promise<boolean>}
   */
  async gc() {
    const maxTimestamp = Date.now() - this.stale_after_ms * 10;

    await Promise.all(
      (await this.db.getAllLessThan('syncAt', 'sync', maxTimestamp)).map(
        (row) => this.prune(row.key)
      )
    );

    return true;
  }
}
