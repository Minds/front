import { Injectable } from "@angular/core";
import { Client } from "../../services/api/client";
import { Session } from "../../services/session";

import AsyncLock from "../../helpers/async-lock";

import MindsClientHttpAdapter from "../../lib/minds-sync/adapters/MindsClientHttpAdapter.js";
import browserStorageAdapterFactory from "../../helpers/browser-storage-adapter-factory";
import BlockListSync from "../../lib/minds-sync/services/BlockListSync.js";
import AsyncStatus from "../../helpers/async-status";

@Injectable()
export class BlockListService {

  protected blockListSync: BlockListSync;

  protected syncLock = new AsyncLock();

  protected status = new AsyncStatus();

  constructor(
    protected client: Client,
    protected session: Session,
  ) {
    this.setUp();
  }

  async setUp() {
    this.blockListSync = new BlockListSync(
      new MindsClientHttpAdapter(this.client),
      await browserStorageAdapterFactory('minds-block-190314'),
    );

    this.blockListSync.setUp();

    //

    this.status.done();

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
    await this.status.untilReady();

    if (this.syncLock.isLocked()) {
      return false;
    }

    this.syncLock.lock();
    this.blockListSync.sync();
    this.syncLock.unlock();
  }

  async prune() {
    await this.status.untilReady();

    if (this.syncLock.isLocked()) {
      return false;
    }

    this.syncLock.lock();
    this.blockListSync.prune();
    this.syncLock.unlock();
  }

  async getList() {
    await this.status.untilReady();
    await this.syncLock.untilUnlocked();

    return await this.blockListSync.getList();
  }

  async add(guid: string) {
    await this.status.untilReady();
    await this.syncLock.untilUnlocked();

    return await this.blockListSync.add(guid);
  }

  async remove(guid: string) {
    await this.status.untilReady();
    await this.syncLock.untilUnlocked();

    return await this.blockListSync.remove(guid);
  }

  static _(client: Client, session: Session) {
    return new BlockListService(client, session);
  }
}
