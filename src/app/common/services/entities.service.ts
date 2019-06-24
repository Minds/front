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
      if (!this.entities[feed.urn]) {
        urnsToFetch.push(feed.urn);
      }
    }

    await this.fetch(urnsToFetch);

    for (const feedItem of feed) {
      entities.push(this.entities[feed.urn]);
    }
    
    return entities;
  }

  /**
   * Return and fetch a single entity via a urn
   * @param urn string
   * @return Object
   */
  async single(urn: string): Promise<Object | false> {
    if (!this.entities[urn]) {
      await this.fetch([ urn ]);
    }
    return this.entities[urn];
  }

  async fetch(urns: string[]): Promise<Array<Object>> {

    const response: any = this.client.get('api/v2/entities/', { urns });

    for (let entity of response.entities) {
      this.entities[entity.urn] = entity;
    }

    return response.entities;
  }

  static _(client: Client) {
    return new EntitiesService(client);
  }
}
