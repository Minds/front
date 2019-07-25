import { Injectable } from '@angular/core';
import { Client } from '../../services/api/client';
import { MindsUser } from "../../interfaces/entities";
import { MindsChannelResponse } from "../../interfaces/responses";

@Injectable()
export class ProService {
  currentChannel: MindsUser;

  constructor(
    protected client: Client,
  ) { }

  async isActive(): Promise<boolean> {
    const result: any = await this.client.get('api/v2/pro');

    if (!result || typeof result.isActive === 'undefined') {
      throw new Error('Unable to check your Pro status');
    }

    return Boolean(result.isActive);
  }

  async enable(): Promise<boolean> {
    // TODO: Payments
    await this.client.post('api/v2/pro');
    return true;
  }

  async disable(): Promise<boolean> {
    await this.client.delete('api/v2/pro');
    return true;
  }

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
}
