import { Injectable } from '@angular/core';
import { MindsChannelResponse } from '../../../interfaces/responses';
import { MindsUser } from '../../../interfaces/entities';
import { Client } from '../../../services/api/client';

@Injectable()
export class ProChannelService {
  currentChannel: MindsUser;

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
    let route = ['/pro', this.currentChannel.username, to, algorithm || 'top'];

    if (query) {
      route.push({ query });
    }

    return route;
  }
}
