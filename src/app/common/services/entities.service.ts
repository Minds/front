import { Injectable } from "@angular/core";
import { Client } from "../../services/api";

import MindsClientHttpAdapter from '../../lib/minds-sync/adapters/MindsClientHttpAdapter.js';
import browserStorageAdapterFactory from "../../helpers/browser-storage-adapter-factory";
import EntitiesSync from '../../lib/minds-sync/services/EntitiesSync.js';
import AsyncStatus from "../../helpers/async-status";
import normalizeUrn from "../../helpers/normalize-urn";

@Injectable()
export class EntitiesService {

  protected entitiesSync: EntitiesSync;

  protected status = new AsyncStatus();

  entities: Object = {};

  constructor(
    protected client: Client
  ) {
  }

  async getFromFeed(feed): Promise<Object[]> {

    if (!feed || !feed.length) {
      return [];
    }

    const urnsToFetch = [];
    const entities = [];

    for (const feedItem of feed) {
      if (feedItem.entity) {
        this.entities[feedItem.urn] = feedItem.entity;
      }
      if (!this.entities[feedItem.urn]) {
        urnsToFetch.push(feedItem.urn);
      }
    }

    if (urnsToFetch.length) {
      await this.fetch(urnsToFetch);
    }

    for (const feedItem of feed) {
      entities.push(this.entities[feedItem.urn]);
    }
    
    return entities;
  }

  /**
   * Return and fetch a single entity via a urn
   * @param urn string
   * @return Object
   */
  async single(urn: string): Promise<Object | false> {
    if (urn.indexOf('urn:') < 0) { // not a urn, so treat as a guid
      urn = `urn:activity:${urn}`; // and assume activity
    }

    if (!this.entities[urn]) {
      await this.fetch([ urn ]);
    }
    return this.entities[urn];
  }

  async fetch(urns: string[]): Promise<Array<Object>> {

    const response: any = await this.client.get('api/v2/entities/', { urns });

    for (const entity of response.entities) {
      this.entities[entity.urn] = entity;
    }

    return response.entities;
  }

  static _(client: Client) {
    return new EntitiesService(client);
  }
}
