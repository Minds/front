import { Injectable, OnDestroy } from '@angular/core';
import { MindsChannelResponse } from '../../../interfaces/responses';
import { MindsUser } from '../../../interfaces/entities';
import { Client } from '../../../services/api/client';
import { EntitiesService } from '../../../common/services/entities.service';
import normalizeUrn from '../../../helpers/normalize-urn';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Session } from '../../../services/session';
import { ActivatedRoute } from '@angular/router';
import { WireCreatorComponent } from '../../wire/creator/creator.component';
import { SessionsStorageService } from '../../../services/session-storage.service';
import { SiteService } from '../../../services/site.service';
import { BehaviorSubject, Subscription } from 'rxjs';

export type RouterLinkToType =
  | 'home'
  | 'all'
  | 'feed'
  | 'videos'
  | 'images'
  | 'articles'
  | 'groups'
  | 'donate'
  | 'login';

export interface NavItems {
  label: string;
  onClick: () => void;
  isActive: () => boolean;
}

@Injectable()
export class ProChannelService implements OnDestroy {
  currentChannel: MindsUser;

  readonly onChannelChange: BehaviorSubject<any> = new BehaviorSubject(null);

  protected featuredContent: Array<any> | null;

  protected menuNavItems: Array<NavItems> = [];

  protected isLoggedIn$: Subscription;


  constructor(
    protected client: Client,
    protected entitiesService: EntitiesService,
    protected session: Session,
    protected route: ActivatedRoute,
    protected modalService: OverlayModalService,
    protected sessionStorage: SessionsStorageService,
    protected site: SiteService
  ) {
    this.listen();
  }

  listen() {
    this.isLoggedIn$ = this.session.loggedinEmitter.subscribe(is => {
      if (!is && this.currentChannel) {
        this.currentChannel.subscribed = false;
      }
    });
  }

  ngOnDestroy() {
    this.isLoggedIn$.unsubscribe();
  }

  async load(id: string) {
    try {
      this.currentChannel = void 0;

      await this.reload(id);

      if (!this.currentChannel.pro_settings.tag_list) {
        this.currentChannel.pro_settings.tag_list = [];
      }

      this.featuredContent = null;

      return this.currentChannel;
    } catch (e) {
      if (e.status === 0) {
        throw new Error('Sorry, there was a timeout error.');
      } else {
        console.log("couldn't load channel", e);
        throw new Error("Sorry, the channel couldn't be found");
      }
    }
  }

  async reload(id: string) {
    const response: MindsChannelResponse = (await this.client.get(
      `api/v1/channel/${id}`
    )) as MindsChannelResponse;

    this.currentChannel = response.channel;
    this.onChannelChange.next(this.currentChannel);

    return this.currentChannel;
  }

  async getFeaturedContent(): Promise<Array<any>> {
    if (!this.currentChannel) {
      throw new Error('No channel');
    }

    if (!this.featuredContent) {
      if (
        this.currentChannel.pro_settings.featured_content &&
        this.currentChannel.pro_settings.featured_content.length
      ) {
        try {
          const urns = this.currentChannel.pro_settings.featured_content.map(
            guid => normalizeUrn(guid)
          );
          const { entities } = (await this.entitiesService.fetch(urns)) as any;

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

  async getContent({
    limit,
    offset,
  }: { limit?: number; offset? } = {}): Promise<{
    content: Array<any>;
    offset: any;
  }> {
    if (!this.currentChannel) {
      throw new Error('No channel');
    }

    const endpoint = `api/v2/feeds/channel/${this.currentChannel.guid}/all/top`;
    const qs = {
      limit: limit || 24,
      from_timestamp: offset || '',
      sync: 1,
      exclude:
        (this.currentChannel.pro_settings.featured_content || []).join(',') ||
        '',
    };

    const {
      entities: feedSyncEntities,
      'load-next': loadNext,
    } = (await this.client.get(endpoint, qs)) as any;
    const { entities } = (await this.entitiesService.fetch(
      feedSyncEntities.map(feedSyncEntity => normalizeUrn(feedSyncEntity.guid))
    )) as any;

    let nextOffset =
      feedSyncEntities && feedSyncEntities.length ? loadNext : '';

    return {
      content: entities,
      offset: nextOffset,
    };
  }

  async getAllCategoriesContent() {
    if (!this.currentChannel) {
      throw new Error('No channel');
    }

    const { content } = (await this.client.get(
      `api/v2/pro/channel/${this.currentChannel.guid}/content`
    )) as any;

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
      root = this.route.parent.pathFromRoot
        .map(route =>
          route.snapshot.url.map(urlSegment => urlSegment.toString()).join('')
        )
        .join('/');
    }

    const route: any[] = [root];

    if (!this.site.isProDomain) {
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
        window.open(
          `${window.Minds.site_url}groups/profile/${entity.guid}`,
          '_blank'
        );
        break;
    }
  }

  getEntityTaxonomy(entity) {
    return entity.type === 'object'
      ? `${entity.type}:${entity.subtype}`
      : entity.type;
  }

  async subscribe() {
    this.currentChannel.subscribed = true;
    this.currentChannel.subscribers_count += 1;

    try {
      const response = (await this.client.post(
        'api/v1/subscribe/' + this.currentChannel.guid
      )) as any;

      if (!response || response.error) {
        throw new Error(response.error || 'Invalid server response');
      }
    } catch (e) {
      this.currentChannel.subscribed = false;
      this.currentChannel.subscribers_count -= 1;
    }
  }

  async unsubscribe() {
    this.currentChannel.subscribed = false;
    this.currentChannel.subscribers_count -= 1;

    try {
      const response = (await this.client.delete(
        'api/v1/subscribe/' + this.currentChannel.guid
      )) as any;

      if (!response || response.error) {
        throw new Error(response.error || 'Invalid server response');
      }
    } catch (e) {
      this.currentChannel.subscribed = true;
      this.currentChannel.subscribers_count += 1;
    }
  }

  async auth() {
    if (!this.site.isProDomain) {
      // Not in Pro domain mode, user already injected
      return;
    }

    try {
      const response = (await this.client.get('api/v1/channel/me')) as any;

      if (response && response.channel) {
        this.session.login(response.channel);
      }
    } catch (e) {
      console.error(e);
    }
  }

  wire() {
    this.sessionStorage.set('pro::wire-modal::open', '1');
    this.modalService
      .create(WireCreatorComponent, this.currentChannel, {
        onComplete: () => {
          this.sessionStorage.destroy('pro::wire-modal::open');
        },
      })
      .onDidDismiss(() => {
        this.sessionStorage.destroy('pro::wire-modal::open');
      })
      .present();
  }

  pushMenuNavItems(navItems: Array<NavItems>, clean?: boolean) {
    if (clean) {
      this.destroyMenuNavItems();
    }

    this.menuNavItems = this.menuNavItems.concat(navItems);
    return this;
  }

  destroyMenuNavItems() {
    this.menuNavItems = [];
    return this;
  }

  getMenuNavItems(): Array<NavItems> {
    return this.menuNavItems;
  }
}
