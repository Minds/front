import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RecentService } from '../../services/ux/recent';
import { Client } from '../../services/api/client';
import { Session } from '../../services/session';
import { Storage } from '../../services/storage';

@Injectable()
export class BlockListService {
  blocked: BehaviorSubject<string[]>;

  constructor(
    protected client: Client,
    protected session: Session,
    protected storage: Storage,
    protected recentService: RecentService
  ) {
    //OK to remove as SSR will handle
    //this.blocked = new BehaviorSubject(JSON.parse(this.storage.get('blocked')));
    this.blocked = new BehaviorSubject([]);
  }

  fetch() {
    this.client
      .get('api/v1/block', { sync: 1, limit: 10000 })
      .then((response: any) => {
        if (response.guids !== this.blocked.getValue())
          this.blocked.next(response.guids); // re-emit as we have a change

        this.storage.set('blocked', JSON.stringify(response.guids)); // save to storage
      })
      .catch((err) => null);
    return this;
  }

  async sync() {}

  async prune() {}

  async get() {}

  async getList(limit: number, offset: string) {
    return this.client.get('api/v1/block', { limit, offset });
  }

  async add(guid: string) {
    const guids = this.blocked.getValue();
    if (guids.indexOf(guid) < 0) this.blocked.next([...guids, ...[guid]]);
    this.storage.set('blocked', JSON.stringify(this.blocked.getValue()));
    this.recentService.storeSuggestion(
      'publisher',
      { guid, blocked: true },
      (entry) => entry.guid === guid
    );
  }

  async remove(guid: string) {
    const guids = this.blocked.getValue();
    const index = guids.indexOf(guid);
    if (index > -1) {
      guids.splice(index, 1);
    }

    this.blocked.next(guids);
    this.storage.set('blocked', JSON.stringify(this.blocked.getValue()));
  }

  static _(
    client: Client,
    session: Session,
    storage: Storage,
    recent: RecentService
  ) {
    return new BlockListService(client, session, storage, recent);
  }
}
