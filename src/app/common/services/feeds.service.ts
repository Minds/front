import { Injectable } from "@angular/core";
import { Client } from "../../services/api/client";
import hashCode from "../../helpers/hash-code";
import { Session } from "../../services/session";
import { EntitiesService } from "./entities.service";
import { BlockListService } from "./block-list.service";
import Dexie from 'dexie';

const STALE_AFTER = 15; // 15 seconds

export type FeedsServiceSyncOptions = {
  filter: string,
  algorithm: string,
  customType: string,
  period?: string,
  limit?: number,
  offset?: number,
  hashtags?: string[],
  all?: boolean,
  query?: string,
  nsfw?: Array<number>,
}

export type FeedsServiceGetResponse = {
  entities: any[],
  next?: number
};

@Injectable()
export class FeedsService {
  protected db: Dexie;

  constructor(
    protected client: Client,
    protected session: Session,
    protected entitiesService: EntitiesService,
    protected blockListService: BlockListService,
  ) {
    this.db = new Dexie('minds_feeds');
    this.db.version(2).stores({
      lists: '[_key+_order], *_key',
      sync: '&_key',
    });
  }

  async get(opts: FeedsServiceSyncOptions): Promise<FeedsServiceGetResponse> {
    const key = this.buildKey(opts);

    await this.db.open();

    if (!opts.offset) {
      const wasSynced = await this.sync(opts);

      if (!wasSynced) {
        console.info('Cannot sync, using cache');
      }
    }

    try {
      // Fetch

      const collection = this.db.table('lists')
        .where('_key').equals(key)
        .offset(opts.offset || 0)
        .limit(opts.limit);

      const docs = await collection.toArray();

      let next;
      if (docs.length > 0) {
        next = (opts.offset || 0) + opts.limit;
      }

      // Hydrate entities

      const entities = await this.entitiesService.fetch(docs.map(doc => doc.guid));

      // Prefetch

      this.prefetch(opts, next);

      //

      return {
        entities,
        next,
      }
    } catch (e) {
      console.error('FeedsService.get', e);
      throw e;
    }
  }

  async prefetch(opts: FeedsServiceSyncOptions, futureOffset: number) {
    if (!futureOffset) {
      return false;
    }

    const key = this.buildKey(opts);

    const collection = this.db.table('lists')
      .where('_key').equals(key)
      .offset(futureOffset)
      .limit(opts.limit);

    const docs = await collection.toArray();

    await this.entitiesService.fetch(docs.map(doc => doc.guid), { prefetch: true });
  }

  async prune(key: string) {
    try {
      await this.db.table('lists')
        .where('_key')
        .equals(key)
        .delete();

      await this.db.table('sync').delete(key);

      return true;
    } catch (e) {
      console.error('FeedsService.prune', e);
      throw e;
    }
  }

  async sync(opts: FeedsServiceSyncOptions): Promise<boolean> {
    const key = this.buildKey(opts);

    // Is sync needed?

    const lastSync = await this.db.table('sync').get(key);

    if (lastSync && lastSync.sync && (lastSync.sync + (STALE_AFTER * 1000)) >= Date.now()) {
      return true;
    }

    // Sync

    try {
      const response: any = await this.client.get(`api/v2/feeds/global/${opts.algorithm}/${opts.customType}`, {
        sync: 1,
        limit: 600,
        period: opts.period || '',
        hashtags: opts.hashtags || '',
        all: opts.all ? 1 : '',
        query: opts.query || '',
        nsfw: opts.nsfw || '',
      }, {
        cache: true
      });

      if (!response.entities || typeof response.entities.length === 'undefined') {
        throw new Error('Invalid server response');
      }

      await this.prune(key);

      const blockedList = await this.blockListService.getList();

      const filteredEntities = response.entities
        .filter(feedSyncEntity => blockedList.indexOf(feedSyncEntity.owner_guid) === -1);

      const entitiesDocs = filteredEntities.map((feedSyncEntity, index) => ({
        ...feedSyncEntity,
        _key: key,
        _order: index,
      }));

      await this.db.table('lists').bulkPut(entitiesDocs);
      await this.db.table('sync').put({ _key: key, sync: Date.now() });
    } catch (e) {
      console.warn('FeedsService.sync', e);
      return false;
    }

    return true;
  }

  buildKey(opts: FeedsServiceSyncOptions): string {
    const userGuid = this.session.getLoggedInUser().guid;

    return hashCode(JSON.stringify([
      userGuid,
      opts.algorithm || '',
      opts.customType || '',
      opts.period || '',
      opts.hashtags || '',
      Boolean(opts.all),
      opts.query || '',
      opts.nsfw || '',
    ]));
  }

  static _(
    client: Client,
    session: Session,
    entitiesService: EntitiesService,
    blockListService: BlockListService,
  ) {
    return new FeedsService(client, session, entitiesService, blockListService);
  }
}
