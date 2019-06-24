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
import { BehaviorSubject, Observable, of, forkJoin } from "rxjs";
import { take, switchMap, map } from "rxjs/operators";

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

  limit: BehaviorSubject<number> = new BehaviorSubject(12);
  offset: BehaviorSubject<number> = new BehaviorSubject(0);
  endpoint: string = '';

  rawFeed: BehaviorSubject<Object[]> = new BehaviorSubject([]);
  feed: Observable<Object[]>;
  inProgress: BehaviorSubject<boolean> = new BehaviorSubject(false);
  hasMore: Observable<boolean>;

  constructor(
    protected client: Client,
    protected session: Session,
    protected entitiesService: EntitiesService,
    protected blockListService: BlockListService,
  ) {
    this.feed = this.rawFeed.pipe(
      take(this.limit.getValue() + this.offset.getValue()),
      switchMap(feed => this.entitiesService.getFromFeed(feed)),
    );
    this.hasMore = this.rawFeed.pipe(
      map(feed => {
        return (this.limit.getValue() + this.offset.getValue()) < feed.length;
      }),
    );
  }

  setEndpoint(endpoint: string): FeedsService {
    this.endpoint = endpoint;
    return this;
  }

  setLimit(limit: number): FeedsService {
    this.limit.next(limit);
    return this;
  }

  setOffset(offset: number): FeedsService {
    this.offset.next(offset);
    return this;
  }

  fetch(): FeedsService {
    this.inProgress.next(true);
    this.client.get(this.endpoint)
      .then((response: any) => {
        this.inProgress.next(false);
        this.rawFeed.next(response.entities);
      })
      .catch(err => {
        this.inProgress.next(false);
      });
    return this;
  }

  clear(): FeedsService {
    this.offset.next(0);
    this.rawFeed.next([]);
    return this;
  }

  hydrateEntities(): FeedsService {
    return this;
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
