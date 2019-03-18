import { Injectable } from "@angular/core";
import { Client } from "../../services/api";
import Dexie from 'dexie';

import MindsClientHttpAdapter from '../../lib/minds-sync/adapters/MindsClientHttpAdapter.js';
import DexieStorageAdapter from '../../lib/minds-sync/adapters/DexieStorageAdapter.js';
import EntitiesSync from '../../lib/minds-sync/services/EntitiesSync.js';

@Injectable()
export class EntitiesService {

  protected db: Dexie;

  protected entitiesSync: EntitiesSync;

  constructor(
    protected client: Client
  ) {
    this.entitiesSync = new EntitiesSync(
      new MindsClientHttpAdapter(this.client),
      new DexieStorageAdapter(new Dexie('minds-entities-190314')),
      15,
    );

    this.entitiesSync.setUp();

    // Garbage collection

    this.entitiesSync.gc();
    setTimeout(() => this.entitiesSync.gc(), 15 * 60 * 1000); // Every 15 minutes
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

  async fetch(guids: string[]): Promise<Object[]> {
    if (!guids || !guids.length) {
      return [];
    }

    const urns = guids.map(guid => `urn:entity:${guid}`);

    return await this.entitiesSync.get(urns);
  }

  async prefetch(guids: string[]): Promise<boolean> {
    if (!guids || !guids.length) {
      return true;
    }

    const urns = guids.map(guid => `urn:entity:${guid}`);

    return await this.entitiesSync.sync(urns);
  }

  static _(client: Client) {
    return new EntitiesService(client);
  }
}
