import { EventEmitter, Injectable } from '@angular/core';
import { Client } from '../../../services/api/client';

type Hashtag = {
  value: string;
  selected: boolean;
};

@Injectable()
export class TopbarHashtagsService {
  selectionChange: EventEmitter<{
    hashtag: Hashtag;
    emitter: any;
  }> = new EventEmitter<{ hashtag: Hashtag; emitter: any }>();

  constructor(private client: Client) {}

  async load(limit: number, opts: any = {}) {
    const response: any = await this.client.get(`api/v2/hashtags/suggested`, {
      limit: limit,
      trending: opts.trending ? 1 : '',
      defaults: opts.defaults ? 1 : '',
    });

    return response.tags.sort(this._sortHashtags);
  }

  async loadAll(opts: any = {}) {
    const response: any = await this.client.get(`api/v2/hashtags/suggested`, {
      limit: opts.softLimit,
      trending: opts.trending ? 1 : '',
      defaults: opts.defaults ? 1 : '',
    });

    return response.tags.sort(this._sortHashtags);
  }

  _sortHashtags(a, b) {
    // By selected

    if (a.selected && !b.selected) {
      return -1;
    } else if (!a.selected && b.selected) {
      return 1;
    }

    // By type
    const typeOrder = ['default', 'trending', 'implicit', 'user']; // Reversed, first ones are less relevant
    const aTypeWeight = typeOrder.findIndex((type) => a.type === type);
    const bTypeWeight = typeOrder.findIndex((type) => b.type === type);

    if (aTypeWeight > bTypeWeight) {
      return -1;
    } else if (bTypeWeight > aTypeWeight) {
      return 1;
    }

    return 0;
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

  cleanupHashtag(hashtag: string) {
    const regex = /\w*/gm;
    let m;
    let result = '';

    while ((m = regex.exec(hashtag)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
        result += match;
      });
    }
    return result;
  }
}
