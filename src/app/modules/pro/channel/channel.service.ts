import { EventEmitter, Injectable } from '@angular/core';
import { MindsChannelResponse } from '../../../interfaces/responses';
import { MindsUser, Tag } from '../../../interfaces/entities';
import { Client } from '../../../services/api/client';
import { EntitiesService } from '../../../common/services/entities.service';
import normalizeUrn from '../../../helpers/normalize-urn';

@Injectable()
export class ProChannelService {

  currentChannel: MindsUser;

  selectedHashtag: Tag;

  selectedHashtagChange: EventEmitter<Tag> = new EventEmitter<Tag>();

  protected featuredContent: Array<any> | null;

  constructor(
    protected client: Client,
    protected entitiesService: EntitiesService,
  ) { }

  async load(id: string) {
    try {
      this.currentChannel = void 0;

      const response: MindsChannelResponse = await this.client.get(`api/v1/channel/${id}`) as MindsChannelResponse;

      this.currentChannel = response.channel;
      this.featuredContent = null;

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

  async getFeaturedContent(): Promise<Array<any>> {
    if (!this.currentChannel) {
      this.featuredContent = null;
      return [];
    }

    if (!this.featuredContent) {
      if (this.currentChannel.pro_settings.featured_content && this.currentChannel.pro_settings.featured_content.length) {
        try {
          const urns = this.currentChannel.pro_settings.featured_content.map(guid => normalizeUrn(guid));
          const { entities } = await this.entitiesService.fetch(urns) as any;

          this.featuredContent = entities;
        } catch (e) {
          this.featuredContent = null;
          return [];
        }
      } else {
        this.featuredContent = [];
      }
    }

    return this.featuredContent;
  }

  setSelectedHashtag(value: Tag) {
    this.selectedHashtag = value;
    this.selectedHashtagChange.emit(this.selectedHashtag);
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
