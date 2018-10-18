import { EventEmitter, Injectable } from '@angular/core';
import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';

@Injectable()
export class NewsfeedService {
  allHashtags: boolean = false;
  onReloadFeed: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private client: Client, private session: Session) {
  }

  public async recordView(entity, visible: boolean = true, channel = null) {
    if (!this.session.isLoggedIn()) {
      return;
    }

    // if it's a boost we record the boost view AND the activity view
    if (entity.boosted_guid) {
      let url = `api/v2/analytics/views/boost/${entity.boosted_guid}`;

      if (channel)
        url += `/${channel.guid}`;

      if (!visible)
        url += `/stop`;

      return await this.client.post(url);
    }

    return await this.client.post(`api/v2/analytics/views/activity/${entity.guid}`);
  }

  public reloadFeed(allHashtags: boolean = false) {
    this.allHashtags = allHashtags;
    this.onReloadFeed.emit(allHashtags);
  }

}