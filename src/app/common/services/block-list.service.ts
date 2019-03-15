import { Injectable } from "@angular/core";
import { Client } from "../../services/api/client";
import { Session } from "../../services/session";
import Dexie from 'dexie';

import AsyncLock from "../../helpers/async-lock";

import MindsClientHttpAdapter from "../../lib/minds-sync/adapters/MindsClientHttpAdapter.js";
import DexieStorageAdapter from "../../lib/minds-sync/adapters/DexieStorageAdapter.js";
import BlockListSync from "../../lib/minds-sync/services/BlockListSync.js";

@Injectable()
export class BlockListService {
  protected syncLock = new AsyncLock();

  protected blockListSync: BlockListSync;

  constructor(
    protected client: Client,
    protected session: Session,
  ) {
    this.blockListSync = new BlockListSync(
      new MindsClientHttpAdapter(this.client),
      new DexieStorageAdapter(new Dexie('minds-block-190314')),
    );

    this.blockListSync.setUp();

    // Prune on session changes

    this.session.isLoggedIn((is: boolean) => {
      if (is) {
        this.sync();
      } else {
        this.prune();
      }
    });
  }

  async sync() {
    if (this.syncLock.isLocked()) {
      return false;
    }

    this.syncLock.lock();
    this.blockListSync.sync();
    this.syncLock.unlock();
  }

  async prune() {
    if (this.syncLock.isLocked()) {
      return false;
    }

    this.syncLock.lock();
    this.blockListSync.prune();
    this.syncLock.unlock();
  }

  async getList() {
    await this.syncLock.untilUnlocked();
    return await this.blockListSync.getList();
  }

  async add(guid: string) {
    await this.syncLock.untilUnlocked();
    return await this.blockListSync.add(guid);
  }

  async remove(guid: string) {
    await this.syncLock.untilUnlocked();
    return await this.blockListSync.remove(guid);
  }

  static _(client: Client, session: Session) {
    return new BlockListService(client, session);
  }
}
