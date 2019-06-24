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
import { take, switchMap, map, tap } from "rxjs/operators";

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
  params: any = { sync: 1 };

  rawFeed: BehaviorSubject<Object[]> = new BehaviorSubject([]);
  feed: Observable<Object[]>;
  inProgress: BehaviorSubject<boolean> = new BehaviorSubject(true);
  hasMore: Observable<boolean>;

  constructor(
    protected client: Client,
    protected session: Session,
    protected entitiesService: EntitiesService,
    protected blockListService: BlockListService,
  ) {
    this.feed = this.rawFeed.pipe(
      tap(() => {
        this.inProgress.next(true);
      }),
      map(feed => feed.slice(0, this.limit.getValue() + this.offset.getValue())),
      switchMap(feed => this.entitiesService.getFromFeed(feed)),
      tap(() => {
        if (this.offset.getValue() > 0) {
          this.inProgress.next(false);
        }
      }),
    );
    this.hasMore = this.rawFeed.pipe(
      map(feed => {
        return this.inProgress.getValue() || (this.limit.getValue() + this.offset.getValue()) < feed.length;
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

  setParams(params): FeedsService {
    this.params = params;
    if (!params.sync) {
      this.params.sync = 1;
    }
    return this;
  }

  setOffset(offset: number): FeedsService {
    this.offset.next(offset);
    return this;
  }

  fetch(): FeedsService {
    this.inProgress.next(true);
    this.client.get(this.endpoint, {...this.params, ...{ limit: 150 }}) // Over 12 scrolls
      .then((response: any) => {
        this.rawFeed.next(response.entities);
      })
      .catch(err => {
      });
    return this;
  }

  loadMore(): FeedsService {
    this.setOffset(this.limit.getValue() + this.offset.getValue());
    this.rawFeed.next(this.rawFeed.getValue());
    return this;
  }

  clear(): FeedsService {
    this.offset.next(0);
    this.inProgress.next(true);
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
