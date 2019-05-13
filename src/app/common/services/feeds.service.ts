import { Injectable } from "@angular/core";

import { Client } from "../../services/api/client";
import { Session } from "../../services/session";

import { EntitiesService } from "./entities.service";
import { BlockListService } from "./block-list.service";

import MindsClientHttpAdapter from "../../lib/minds-sync/adapters/MindsClientHttpAdapter.js";
import browserStorageAdapterFactory from "../../helpers/browser-storage-adapter-factory";
import FeedsSync from '../../lib/minds-sync/services/FeedsSync.js';

import hashCode from "../../helpers/hash-code";
import AsyncStatus from "../../helpers/async-status";

export type FeedsServiceGetParameters = {
  endpoint: string;
  timebased: boolean;

  //
  limit: number;
  offset?: number;

  //
  syncPageSize?: number;
  forceSync?: boolean;
}

export type FeedsServiceGetResponse = {
  entities: any[],
  next?: number
};

@Injectable()
export class FeedsService {

  protected feedsSync: FeedsSync;

  protected status = new AsyncStatus();

  constructor(
    protected client: Client,
    protected session: Session,
    protected entitiesService: EntitiesService,
    protected blockListService: BlockListService,
  ) {
    this.setUp();
  }

  async setUp() {
    this.feedsSync = new FeedsSync(
      new MindsClientHttpAdapter(this.client),
      await browserStorageAdapterFactory('minds-feeds-190314'),
      15,
    );

    this.feedsSync.setResolvers({
      stringHash: value => hashCode(value),
      currentUser: () => this.session.getLoggedInUser() && this.session.getLoggedInUser().guid,
      blockedUserGuids: async () => await this.blockListService.getList(),
      fetchEntities: async guids => await this.entitiesService.fetch(guids),
    });

    this.feedsSync.setUp();

    // Mark as done

    this.status.done();

    // Garbage collection

    this.feedsSync.gc();
    setTimeout(() => this.feedsSync.gc(), 15 * 60 * 1000); // Every 15 minutes
  }

  async get(opts: FeedsServiceGetParameters): Promise<FeedsServiceGetResponse> {
    await this.status.untilReady();

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

  async destroy() {
    await this.status.untilReady();
    return await this.feedsSync.destroy();
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
