import { EventEmitter, Injectable } from '@angular/core';
import { MindsChannelResponse } from '../../../interfaces/responses';
import { MindsUser } from '../../../interfaces/entities';
import { Client } from '../../../services/api/client';
import { EntitiesService } from '../../../common/services/entities.service';
import normalizeUrn from '../../../helpers/normalize-urn';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { BlogView } from "../../blogs/view/view";
import { Session } from '../../../services/session';
import { ActivatedRoute } from '@angular/router';

export type RouterLinkToType =
  'home'
  | 'all'
  | 'feed'
  | 'videos'
  | 'images'
  | 'articles'
  | 'groups'
  | 'donate'
  | 'login';

@Injectable()
export class ProChannelService {

  currentChannel: MindsUser;

  subscriptionChange: EventEmitter<number> = new EventEmitter<number>();

  protected featuredContent: Array<any> | null;

  constructor(
    protected client: Client,
    protected entitiesService: EntitiesService,
    protected session: Session,
    protected route: ActivatedRoute,
  ) {
  }

  async load(id: string) {
    try {
      this.currentChannel = void 0;

      const response: MindsChannelResponse = await this.client.get(`api/v1/channel/${id}`) as MindsChannelResponse;

      this.currentChannel = response.channel;

      if (!this.currentChannel.pro_settings.tag_list) {
        this.currentChannel.pro_settings.tag_list = [];
      }

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

  async getAllCategoriesContent() {
    if (!this.currentChannel) {
      throw new Error('No channel');
    }

    const { content } = await this.client.get(`api/v2/pro/channel/${this.currentChannel.guid}/content`) as any;

    return content
      .filter(entry => entry && entry.content && entry.content.length)
      .map(entry => {
        entry.content = entry.content.map(item => {
          if (item.entity) {
            return Promise.resolve(item.entity);
          }

          return this.entitiesService.single(item.urn);
        });

        return entry;
      });
  }

  getRouterLink(to: RouterLinkToType, params?: { [key: string]: any }): any[] {
    let root = '/';

    if (this.route.parent) {
      root = this.route.parent.pathFromRoot.map(route => route.snapshot.url.map(urlSegment => urlSegment.toString()).join('')).join('/');
    }

    const route: any[] = [root];

    if (!window.Minds.pro) {
      route.push(this.currentChannel.username);
    }

    switch (to) {
      case 'home':
        /* Root */
        break;

      case 'all':
      case 'feed':
      case 'videos':
      case 'images':
      case 'articles':
      case 'groups':
        route.push(to);

        if (params) {
          route.push(params);
        }
        break;

      case 'donate':
        route.push(to);
        break;

      case 'login':
        route.push('login');
        break;
    }

    return route;
  }

  open(entity, modalServiceContext: OverlayModalService) {
    switch (this.getEntityTaxonomy(entity)) {
      case 'group':
        window.open(`${window.Minds.site_url}groups/profile/${entity.guid}`, '_blank');
        break;
      case 'object:blog':
        modalServiceContext.create(BlogView, entity).present();
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

  async auth() {
    if (!window.Minds.pro) {
      // Not in standalone mode
      return;
    }

    try {
      const response = await this.client.get('api/v1/channel/me') as any;

      if (response && response.channel) {
        this.session.login(response.channel);
      }
    } catch (e) {
      console.error(e);
    }
  }
}
