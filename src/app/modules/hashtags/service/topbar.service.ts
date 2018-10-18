import { EventEmitter, Injectable } from '@angular/core';
import { Client } from '../../../services/api/client';

type Hashtag = {
  value: string, selected: boolean
};

@Injectable()
export class TopbarHashtagsService {
  selectionChange: EventEmitter<{ hashtag: Hashtag, emitter: any }> = new EventEmitter<{ hashtag: Hashtag, emitter: any }>();

  constructor(private client: Client) {
  }

  async load(limit: number) {
    const response: any = await this.client.get(`api/v2/hashtags/suggested`, {
      limit: limit
    });

    return response.tags.sort(function (a, b) {
      if (a.selected && !b.selected) {
        return -1;
      }
      if (!a.selected && b.selected) {
        return 1;
      }
      return 0;
    });
  }

  async toggleSelection(hashtag: Hashtag, emitter: any) {
    hashtag.selected = !hashtag.selected;
    try {
      if (!hashtag.selected) {
        await this.client.delete(`api/v2/hashtags/user/${hashtag.value}`);
      } else {
        await this.client.post(`api/v2/hashtags/user/${hashtag.value}`);
      }
      this.selectionChange.emit({ hashtag, emitter });
    } catch (e) {
      hashtag.selected = !hashtag.selected;
      console.error(e);
    }
  }
}
