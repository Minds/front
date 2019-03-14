import { Injectable } from "@angular/core";
import { Client } from "../../services/api";
import Dexie from 'dexie';

const STALE_AFTER = 2 * 60; // 2 minutes cache

@Injectable()
export class EntitiesService {
  protected db: Dexie;

  constructor(
    protected client: Client
  ) {
    this.db = new Dexie('minds_entities');
    this.db.version(2).stores({
      entities: '&urn'
    });
  }

  async single(guid: string): Promise<Object | false> {
    try {
      const entities = await this.fetch([guid]);

      if (!entities || !entities[0]) {
        return false;
      }

      return entities[0];
    } catch (e) {
      console.error('EntitiesService.get', e);
      return false;
    }
  }

  async fetch(guids: string[], opts: { prefetch?: boolean } = {}): Promise<Object[]> {
    if (!guids || !guids.length) {
      return [];
    }

    const urns = guids.map(guid => `urn:entity:${guid}`);

    const wasSynced = await this.sync(urns);

    if (!wasSynced) {
      console.info('Cannot sync, using cache');
    }

    if (opts.prefetch) {
      return [];
    }

    // Fetch entity as-is on DB

    const entities = await this.db.table('entities')
      .where('urn').anyOf(urns)
      .toArray();

    // Sort and filter

    const result = urns
      .map(urn => entities.find(entity => entity.urn === urn))
      .filter(entity => Boolean(entity));

    //

    return result;
  }

  async sync(urns: string[]): Promise<boolean> {
    if (!urns || !urns.length) {
      return true;
    }

    // Only sync stale entities

    const cachedEntities = await this.db.table('entities')
      .where('urn').anyOf(urns)
      .toArray();

    urns = urns.filter(urn => {
      const cached = cachedEntities.find(entity => entity.urn === urn);
      return !cached || !cached._sync || (cached._sync + (STALE_AFTER * 1000)) < Date.now();
    });

    if (!urns || !urns.length) {
      return true;
    }

    //

    try {
      const { entities }: any = await this.client.get('api/v2/entities', {
        urns
      }, { cache: true });

      const entityDocs = entities.map(entity => ({
        ...entity,
        urn: `urn:entity:${entity.guid}`,
        _sync: Date.now(),
      }));

      await this.db.table('entities').bulkPut(entityDocs);
    } catch (e) {
      console.warn('EntitiesService.fetch', e);
      return false;
    }

    return true;
  }

  static _(client: Client) {
    return new EntitiesService(client);
  }
}
