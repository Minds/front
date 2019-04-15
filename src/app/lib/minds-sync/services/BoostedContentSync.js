const E_NO_RESOLVER = function () {
  throw new Error('Resolver not set')
};

export default class BoostedContentSync {
  /**
   * @param {MindsClientHttpAdapter|MindsMobileClientHttpAdapter} http
   * @param {DexieStorageAdapter|InMemoryStorageAdapter|SqliteStorageAdapter} db
   * @param {Number} stale_after
   * @param {Number} cooldown
   * @param {Number} limit
   */
  constructor(http, db, stale_after, cooldown, limit) {
    this.http = http;
    this.db = db;
    this.stale_after_ms = stale_after * 1000;
    this.cooldown_ms = cooldown * 1000;
    this.limit = limit;

    this.rating = null;

    this.resolvers = {
      currentUser: E_NO_RESOLVER,
      blockedUserGuids: E_NO_RESOLVER,
      fetchEntities: E_NO_RESOLVER,
    };

    this.synchronized = null;

    this.locks = [];
  }

  /**
   * @returns {boolean}
   */
  setUp() {
    this.db.schema(2, {
      boosts: {
        primaryKey: 'urn',
        indexes: ['sync', 'lastImpression']
      },
    });

    this.db.schema(2.1, {
      boosts: {
        primaryKey: 'urn',
        indexes: ['sync', 'lastImpression', 'owner_guid']
      },
    });

    return true;
  }

  /**
   * @param {Object} resolvers
   * @returns {BoostedContentSync}
   */
  setResolvers(resolvers) {
    this.resolvers = Object.assign(this.resolvers, resolvers);
    return this;
  }

  /**
   * @param rating
   * @returns {BoostedContentSync}
   */
  setRating(rating) {
    this.rating = rating;
    return this;
  }

  /**
   * @param rating
   * @returns {Promise<boolean>}
   */
  async changeRating(rating) {
    this.setRating(rating);
    await this.destroy();

    return true;
  }

  /**
   * @param {Object} opts
   * @returns {Promise<*>}
   */
  async fetch(opts = {}) {
    await this.db.ready();

    // Prune list

    await this.prune();

    // Check if a sync is needed

    if (opts.forceSync || !this.synchronized || (this.synchronized <= Date.now() - this.cooldown_ms)) {
      const wasSynced = await this.sync(opts);

      if (!wasSynced) {
        console.info('Cannot sync, using cache');
      } else {
        this.synchronized = Date.now();
      }
    }

    // Fetch

    let lockedUrn;

    try {
      const rows = (await this.db.getAllLessThan('boosts', 'lastImpression', Date.now() - this.cooldown_ms, { sortBy: 'impressions' }))
        .filter(row => row && row.urn && (this.locks.indexOf(row.urn) === -1));

      if (!rows || !rows.length) {
        return null;
      }

      // Pick first unlocked result

      const { urn, impressions } = rows[0];

      // lock this URN

      lockedUrn = urn;
      this.locks.push(lockedUrn);

      // Increase counter

      await this.db.update('boosts', urn, {
        impressions: impressions + 1,
        lastImpression: Date.now(),
      });

      // Release lock

      if (lockedUrn) {
        this.locks = this.locks.filter(lock => lock !== lockedUrn);
      }

      // Hydrate entities

      return await this.resolvers.fetchEntity(urn);
    } catch (e) {
      console.error('BoostedContentSync.fetch', e);

      // Release lock

      if (lockedUrn) {
        this.locks = this.locks.filter(lock => lock !== lockedUrn);
      }

      // Return empty

      return null;
    }
  }

  /**
   * @param {Object} opts
   * @returns {Promise<boolean>}
   */
  async sync(opts) {
    await this.db.ready();

    // Sync

    try {
      const params = {
        sync: 1,
        limit: this.limit,
      };

      if (this.rating !== null) {
        params.rating = this.rating;
      }

      const response = await this.http.get(`api/v2/boost/fetch`, params, true);

      if (!response.boosts || typeof response.boosts.length === 'undefined') {
        throw new Error('Invalid server response');
      }

      // Read blocked list

      const blockedList = await this.resolvers.blockedUserGuids();

      // Setup rows

      const entities = response.boosts
        .filter(feedSyncEntity => blockedList.indexOf(feedSyncEntity.owner_guid) === -1)
        .map(feedSyncEntity => Object.assign({
          sync: Date.now(),
        }, feedSyncEntity));

      // Insert onto DB

      await Promise.all(entities.map(entity => this.db.upsert('boosts', entity.urn, entity, {
        impressions: 0,
        lastImpression: 0
      })));
    } catch (e) {
      console.warn('BoostedContentSync.sync', e);
      return false;
    }

    return true;
  }

  /**
   * @returns {Promise<boolean>}
   */
  async prune() {
    try {
      await this.db
        .deleteLessThan('boosts', 'sync', Date.now() - this.stale_after_ms);

      await this.db
        .deleteAnyOf('boosts', 'owner_guid', (await this.resolvers.blockedUserGuids()) || []);

      return true;
    } catch (e) {
      console.error('BoostedContentSync.prune', e);
      throw e;
    }
  }

  /**
   * @returns {Promise<boolean>}
   */
  async destroy() {
    try {
      await Promise.all([
        this.db.truncate('boosts'),
      ]);

      this.synchronized = null;

      return true;
    } catch (e) {
      console.error('BoostedContentSync.destroy', e);
      throw e;
    }
  }

  /**
   * @returns {Promise<boolean>}
   */
  async gc() {
    await this.db.ready();
    await this.prune();

    this.synchronized = null;

    return true;
  }
}
