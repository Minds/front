import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Client } from "../../services/api";
import { BlockListService } from './block-list.service';

import MindsClientHttpAdapter from '../../lib/minds-sync/adapters/MindsClientHttpAdapter.js';
import browserStorageAdapterFactory from "../../helpers/browser-storage-adapter-factory";
import EntitiesSync from '../../lib/minds-sync/services/EntitiesSync.js';
import AsyncStatus from "../../helpers/async-status";
import normalizeUrn from "../../helpers/normalize-urn";

type EntityObservable = BehaviorSubject<Object>;

interface EntityObservables {
   [key: string]: EntityObservable 
}

@Injectable()
export class EntitiesService {

  entities: EntityObservables = {};

  constructor(
    protected client: Client,
    protected blockListService: BlockListService,
  ) {
  }

  async getFromFeed(feed): Promise<EntityObservable[]> {

    if (!feed || !feed.length) {
      return [];
    }

    const blockedGuids = await this.blockListService.blocked.pipe(first()).toPromise();
    const urnsToFetch = [];
    const urnsToResync = [];
    const entities = [];

    for (const feedItem of feed) {
      if (feedItem.entity) {
        this.addEntity(feedItem.entity);
      }
      if (!this.entities[feedItem.urn]) {
        urnsToFetch.push(feedItem.urn);
      }
      if (this.entities[feedItem.urn] && !feedItem.entity) {
        urnsToResync.push(feedItem.urn);
      }
    }

    // Fetch entities we don't have

    if (urnsToFetch.length) {
      await this.fetch(urnsToFetch);
    }

    // Fetch entities, asynchronously, with no need to wait

    if (urnsToResync.length) {
      this.fetch(urnsToResync);
    }

    for (const feedItem of feed) {
      if (blockedGuids.indexOf(feedItem.owner_guid) < 0)
        entities.push(this.entities[feedItem.urn]);
    }
    
    return entities;
  }

  /**
   * Return and fetch a single entity via a urn
   * @param urn string
   * @return Object
   */
  single(urn: string): EntityObservable {
    if (urn.indexOf('urn:') < 0) { // not a urn, so treat as a guid
      urn = `urn:activity:${urn}`; // and assume activity
    }

    this.entities[urn] = new BehaviorSubject(null);

    this.fetch([ urn ]); // Update in the background

    return this.entities[urn];
  }

  /**
   * Fetch entities
   * @param urns string[]
   * @return []
   */
  async fetch(urns: string[]): Promise<Array<Object>> {

    try {
      const response: any = await this.client.get('api/v2/entities/', { urns });

      if (!response.entities.length) {
        for (const urn of urns) {
          this.addNotFoundEntity(urn); 
        }
      }

      for (const entity of response.entities) {
        this.addEntity(entity); 
      }

      return response;
    } catch (err) {
      // TODO: find a good way of sending server errors to subscribers
    }
  }

  /**
   * Add or resync an entity
   * @param entity
   * @return void
   */
  addEntity(entity): void {
    if (this.entities[entity.urn]) {
      this.entities[entity.urn].next(entity);
    } else {
      this.entities[entity.urn] = new BehaviorSubject(entity);
    }
  }

  /**
   * Register a urn as not found
   * @param urn string
   * @return void
   */
  addNotFoundEntity(urn): void {
    if (!this.entities[urn]) {
      this.entities[urn] = new BehaviorSubject(null);
    }
    this.entities[urn].error("Not found");
  }

  static _(client: Client, blockListService: BlockListService) {
    return new EntitiesService(client, blockListService);
  }
}
