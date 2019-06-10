import { Injectable } from "@angular/core";
import { Client } from "../../services/api";

import MindsClientHttpAdapter from '../../lib/minds-sync/adapters/MindsClientHttpAdapter.js';
import browserStorageAdapterFactory from "../../helpers/browser-storage-adapter-factory";
import EntitiesSync from '../../lib/minds-sync/services/EntitiesSync.js';
import { AsyncStatus } from "../../helpers/async-status";
import normalizeUrn from "../../helpers/normalize-urn";

@Injectable()
export class EntitiesService {

  protected entitiesSync: EntitiesSync;

  constructor(
    protected client: Client,
    protected status: AsyncStatus,
  ) {
    this.setUp();
  }

  async setUp() {
    this.entitiesSync = new EntitiesSync(
      new MindsClientHttpAdapter(this.client),
      await browserStorageAdapterFactory('minds-entities-190314'),
      15,
    );

    this.entitiesSync.setUp();

    //

    this.status.done();

    // Garbage collection

    this.entitiesSync.gc();
    //setTimeout(() => this.entitiesSync.gc(), 15 * 60 * 1000); // Every 15 minutes
  }

  async single(guid: string): Promise<Object | false> {
    await this.status.untilReady();

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
    await this.status.untilReady();

    if (!guids || !guids.length) {
      return [];
    }

    const urns = guids.map(guid => normalizeUrn(guid));

    if (!this.entitiesSync) 
      await this.setUp();

    return await this.entitiesSync.get(urns);
  }

  static _(client: Client, status: AsyncStatus) {
    return new EntitiesService(client, status);
  }
}
