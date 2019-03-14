import { Client } from "../../services/api/client";
import { Session } from "../../services/session";
import AsyncLock from "../../helpers/async-lock";
import Dexie from "dexie";

export class BlockListService {

  protected db: Dexie;

  protected syncLock = new AsyncLock();

  constructor(
    protected client: Client,
    protected session: Session,
  ) {
    this.db = new Dexie('minds_block');

    this.db.version(2).stores({
      list: '&guid'
    });
  }

  async sync() {
    if (this.syncLock.isLocked()) {
      return false;
    }

    this.syncLock.lock();

    try {
      const response: any = await this.client.get(`api/v1/block`, {
        sync: 1,
        limit: 10000,
      });

      if (!response || !response.guids) {
        throw new Error('Invalid server response');
      }

      await this.prune();

      const blockListDocs = response.guids.map(guid => ({
        guid
      }));

      await this.db.table('list').bulkPut(blockListDocs);
    } catch (e) {
      console.warn(e);
    }

    this.syncLock.unlock();
  }

  async getList() {
    await this.syncLock.untilUnlocked();
    return (await this.db.table('list').toArray()).map(row => row.guid);
  }

  async add(guid: string) {
    await this.syncLock.untilUnlocked();
    return await this.db.table('list').put({ guid });
  }

  async remove(guid: string) {
    await this.syncLock.untilUnlocked();
    return await this.db.table('list').delete(guid);
  }

  protected async prune() {
    this.db.table('list').clear();
  }

  static _(client: Client, session: Session) {
    return new BlockListService(client, session);
  }
}
