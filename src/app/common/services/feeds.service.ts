import { Injectable } from "@angular/core";
import { Client } from "../../services/api/client";
import hashCode from "../../helpers/hash-code";
import { Session } from "../../services/session";
import { EntitiesService } from "./entities.service";
import { BlockListService } from "./block-list.service";
import Dexie from 'dexie';

import MindsClientHttpAdapter from "../../lib/minds-sync/adapters/MindsClientHttpAdapter.js";
import DexieStorageAdapter from "../../lib/minds-sync/adapters/DexieStorageAdapter.js";
import FeedsSync from '../../lib/minds-sync/services/FeedsSync.js';

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

  protected feedsSync: FeedsSync;

  constructor(
    protected client: Client,
    protected session: Session,
    protected entitiesService: EntitiesService,
    protected blockListService: BlockListService,
  ) {
    this.feedsSync = new FeedsSync(
      new MindsClientHttpAdapter(this.client),
      new DexieStorageAdapter(new Dexie('minds-feeds-190314')),
      15,
      600,
    );

    this.feedsSync.setResolvers({
      stringHash: value => hashCode(value),
      currentUser: () => this.session.getLoggedInUser() && this.session.getLoggedInUser().guid,
      blockedUserGuids: async () => await this.blockListService.getList(),
      fetchEntities: async guids => await this.entitiesService.fetch(guids),
      prefetchEntities: async guids => await this.entitiesService.prefetch(guids),
    });

    this.feedsSync.setUp();

    // Garbage collection

    this.feedsSync.gc();
    setTimeout(() => this.feedsSync.gc(), 15 * 60 * 1000); // Every 15 minutes
  }

  async get(opts: FeedsServiceSyncOptions): Promise<FeedsServiceGetResponse> {
    try {
      const { entities, next } = await this.feedsSync.get(opts);

      return {
        entities,
        next,
      }
    } catch (e) {
      console.error('FeedsService.get', e);
      throw e;
    }
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
