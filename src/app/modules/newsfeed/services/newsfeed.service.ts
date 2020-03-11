import { EventEmitter, Injectable } from '@angular/core';
import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';
import { NSFWSelectorConsumerService } from '../../../common/components/nsfw-selector/nsfw-selector.service';

@Injectable()
export class NewsfeedService {
  allHashtags: boolean = false;
  onReloadFeed: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private client: Client,
    private session: Session,
    private nsfwSelectorService: NSFWSelectorConsumerService
  ) {}

  get nsfw(): Array<number> {
    return this.nsfwSelectorService
      .build()
      .reasons.filter(reason => reason.selected)
      .map(reason => reason.value);
  }

  public async recordView(
    entity,
    visible: boolean = true,
    channel = null,
    clientMeta = {}
  ) {
    // if (!this.session.isLoggedIn()) {
    //   return;
    // }

    // if it's a boost we record the boost view AND the activity view
    if (entity.boosted_guid) {
      let url = `api/v2/analytics/views/boost/${entity.boosted_guid}`;

      if (channel) url += `/${channel.guid}`;

      if (!visible) url += `/stop`;

      return await this.client.post(url, {
        client_meta: clientMeta,
      });
    }

    return await this.client.post(
      `api/v2/analytics/views/activity/${entity.guid}`,
      {
        client_meta: clientMeta,
      }
    );
  }

  public reloadFeed(allHashtags: boolean = false) {
    this.allHashtags = allHashtags;
    this.onReloadFeed.emit(allHashtags);
  }

  setNSFW(reasons: Array<{ value; label; selected }>) {
    this.onReloadFeed.emit(this.allHashtags);
  }
}
