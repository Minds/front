import normalizeUrn from '../../../helpers/normalize-urn';

export default class EntitiesSync {
  /**
   * @param {MindsClientHttpAdapter|MindsMobileClientHttpAdapter} http
   * @param {DexieStorageAdapter|InMemoryStorageAdapter|SqliteStorageAdapter} db
   * @param {Number} stale_after
   */
  constructor(http, db, stale_after) {
    this.http = http;
    this.db = db;
    this.stale_after_ms = stale_after * 1000;
  }

  /**
   * @returns {boolean}
   */
  setUp() {
    this.db.schema(1, {
      entities: {
        primaryKey: 'urn',
        indexes: ['_syncAt'],
      },
    });

    return true;
  }

  /**
   * @param {string[]} urns
   * @returns {Promise<*[]>}
   */
  async get(urns) {
    await this.db.ready();

    // Attempt to sync

    const wasSynced = await this.sync(urns);

    if (!wasSynced) {
      console.info('Error during sync. Using local data.');
    }

    // Fetch entity as-is on DB

    const entities = await this.db.anyOf('entities', 'urn', urns);

    // Sort, filter and return

    return urns
      .map((urn) => entities.find((entity) => entity.urn === urn))
      .filter((entity) => Boolean(entity));
  }

  /**
   * @param {string[]} urns
   * @returns {Promise<boolean>}
   */
  async sync(urns) {
    await this.db.ready();

    if (!urns || !urns.length) {
      return true;
    }

    // Only sync stale entities

    const cachedEntities = await this.db.anyOf('entities', 'urn', urns);

    urns = urns.filter((urn) => {
      const cached = cachedEntities.find((entity) => entity.urn === urn);
      return (
        !cached ||
        !cached._syncAt ||
        cached._syncAt + this.stale_after_ms < Date.now()
      );
    });

    if (!urns || !urns.length) {
      return true;
    }

    //

    try {
      const response = await this.http.get(
        'api/v2/entities',
        {
          urns,
          as_activities: 1,
        },
        true
      );

      if (!response || !response.entities) {
        throw new Error('Invalid server response');
      }

      const entities = response.entities.map((entity) => {
        let obj = {
          urn: normalizeUrn(entity.urn || entity.guid),
          _syncAt: Date.now(),
        };
        obj = Object.assign(obj, entity);
        return obj;
      });
      await this.db.bulkInsert('entities', entities);
    } catch (e) {
      console.warn('EntitiesService.fetch', e);
      return false;
    }

    return true;
  }

  /**
   * @returns {Promise<number>}
   */
  async gc() {
    await this.db.ready();
    return await this.db.deleteLessThan(
      'entities',
      '_syncAt',
      Date.now() - this.stale_after_ms
    );
  }
}
