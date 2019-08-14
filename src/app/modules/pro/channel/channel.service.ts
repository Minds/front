import { EventEmitter, Injectable } from '@angular/core';
import { MindsChannelResponse } from '../../../interfaces/responses';
import { MindsUser } from '../../../interfaces/entities';
import { Client } from '../../../services/api/client';
import { EntitiesService } from '../../../common/services/entities.service';
import normalizeUrn from '../../../helpers/normalize-urn';
import { ProContentModalComponent } from './content-modal/modal.component';
import { OverlayModalService } from '../../../services/ux/overlay-modal';

@Injectable()
export class ProChannelService {

  currentChannel: MindsUser;

  subscriptionChange: EventEmitter<number> = new EventEmitter<number>();

  protected featuredContent: Array<any> | null;

  constructor(
    protected client: Client,
    protected entitiesService: EntitiesService,
  ) {
  }

  async load(id: string) {
    try {
      this.currentChannel = void 0;

      const response: MindsChannelResponse = await this.client.get(`api/v1/channel/${id}`) as MindsChannelResponse;

      this.currentChannel = response.channel;
      this.currentChannel.pro_settings.tag_list.unshift({ tag: 'all', label: 'All', selected: false });
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
      throw new Error('No channel');
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

  async getContent({ limit, offset }: { limit?: number, offset? } = {}): Promise<{ content: Array<any>, offset: any }> {
    if (!this.currentChannel) {
      throw new Error('No channel');
    }

    const endpoint = `api/v2/feeds/channel/${this.currentChannel.guid}/all/top`;
    const qs = {
      limit: limit || 24,
      from_timestamp: offset || '',
      sync: 1,
      exclude: ((this.currentChannel.pro_settings.featured_content || []).join(',')) || '',
    };

    const { entities: feedSyncEntities, 'load-next': loadNext } = await this.client.get(endpoint, qs) as any;
    const { entities } = await this.entitiesService.fetch(feedSyncEntities.map(feedSyncEntity => normalizeUrn(feedSyncEntity.guid))) as any;

    let nextOffset = feedSyncEntities && feedSyncEntities.length ? loadNext : '';

    return {
      content: entities,
      offset: nextOffset,
    };
  }

  linkTo(to, query, algorithm?) {
    let route = ['/pro', this.currentChannel.username, to];

    if (algorithm) {
      route.push(algorithm);
    }

    if (query) {
      route.push({ query });
    }

    return route;
  }

  open(entity, modalServiceContext: OverlayModalService) {
    switch (this.getEntityTaxonomy(entity)) {
      case 'group':
        window.open(`${window.Minds.site_url}groups/profile/${entity.guid}`, '_blank');
        break;
      case 'object:blog':
        window.open(`${window.Minds.site_url}${entity.route}/`, '_blank');
        break;
      case 'object:image':
      case 'object:video':
        modalServiceContext.create(ProContentModalComponent, entity, {
          class: 'm-overlayModal--media'
        }).present();
        break;
    }
  }

  getEntityTaxonomy(entity) {
    return entity.type === 'object' ? `${entity.type}:${entity.subtype}` : entity.type;
  }

  async subscribe() {
    this.currentChannel.subscribed = true;
    
    this.client.post('api/v1/subscribe/' + this.currentChannel.guid, {})
      .then((response: any) => {
        if (response && response.error) {
          throw 'error';
        }

        this.currentChannel.subscribed = true;
        this.subscriptionChange.emit(++this.currentChannel.subscribers_count);
      })
      .catch((e) => {
        this.currentChannel.subscribed = false;
        alert('You can\'t subscribe to this user.');
      });
  }

  async unsubscribe() {
    this.currentChannel.subscribed = false;
    this.client.delete('api/v1/subscribe/' + this.currentChannel.guid, {})
      .then((response: any) => {
        this.currentChannel.subscribed = false;
        this.subscriptionChange.emit(--this.currentChannel.subscribers_count);
      })
      .catch((e) => {
        this.currentChannel.subscribed = true;
      });
  }
}
