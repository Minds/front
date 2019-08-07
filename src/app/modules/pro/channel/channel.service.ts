import { EventEmitter, Injectable } from '@angular/core';
import { MindsChannelResponse } from '../../../interfaces/responses';
import { MindsUser, Tag } from '../../../interfaces/entities';
import { Client } from '../../../services/api/client';

@Injectable()
export class ProChannelService {
  currentChannel: MindsUser;
  selectedHashtag: Tag;

  selectedHashtagChange: EventEmitter<Tag> = new EventEmitter<Tag>();

  setSelectedHashtag(value: Tag) {
    this.selectedHashtag = value;
    this.selectedHashtagChange.emit(this.selectedHashtag);
  }

  constructor(
    protected client: Client,
  ) { }

  async load(id: string) {
    try {
      this.currentChannel = void 0;

      const response: MindsChannelResponse = await this.client.get(`api/v1/channel/${id}`) as MindsChannelResponse;

      this.currentChannel = response.channel;

      return this.currentChannel;
    } catch (e) {
      if (e.status === 0) {
        throw new Error('Sorry, there was a timeout error.');
      } else {
        console.log('couldn\'t load channel', e);
        throw new Error('Sorry, the channel couldn\'t be found');
      }
    }
  }

  linkTo(to, query, algorithm?) {
    let route = ['/pro', this.currentChannel.username, to];

    if(algorithm) {
      route.push(algorithm);
    }

    if (query) {
      route.push({ query });
    }

    return route;
  }
}
