import { Injectable, OnDestroy } from '@angular/core';
import { MindsChannelResponse } from '../../../interfaces/responses';
import { MindsUser } from '../../../interfaces/entities';
import { Client } from '../../../services/api/client';
import { FeedsService } from '../../../common/services/feeds.service';
import normalizeUrn from '../../../helpers/normalize-urn';
import { Session } from '../../../services/session';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionsStorageService } from '../../../services/session-storage.service';
import { SiteService } from '../../../common/services/site.service';
import { BehaviorSubject, Subscription, Observable, combineLatest } from 'rxjs';
import { AnalyticsService } from '../../../services/analytics';
import { WireEventType } from '../../wire/v2/wire-v2.service';
import { WireModalService } from '../../wire/wire-modal.service';
import { MetaService } from '../../../common/services/meta.service';
import { map } from 'rxjs/operators';
import { ToasterService } from '../../../common/services/toaster.service';

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

type PaginationParams = { limit?: number; offset?: any };
type FeedsResponse = {
  content: Array<any>;
  offset: any;
};

@Injectable()
export class ProChannelService implements OnDestroy {
  currentChannel: MindsUser;

  readonly onChannelChange: BehaviorSubject<any> = new BehaviorSubject(null);

  readonly isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  readonly isOwner$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  readonly userIsMember$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  readonly userIsSubscribed$: BehaviorSubject<boolean> = new BehaviorSubject(
    true
  );

  readonly lowestSupportTier$: BehaviorSubject<any> = new BehaviorSubject(null);

  readonly showJoinButton$: Observable<boolean>;

  readonly showLoginRow$: Observable<boolean>;

  readonly showSplash$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  protected featuredContent: Array<any> | null;

  protected menuNavItems: Array<NavItems> = [];

  public isLoggedInSubscription: Subscription;

  constructor(
    protected client: Client,
    protected feedsService: FeedsService,
    protected session: Session,
    protected route: ActivatedRoute,
    protected wireModal: WireModalService,
    protected sessionStorage: SessionsStorageService,
    protected router: Router,
    protected site: SiteService,
    protected analytics: AnalyticsService,
    private metaService: MetaService,
    private toasterService: ToasterService
  ) {
    this.listen();

    this.showJoinButton$ = combineLatest([
      this.isOwner$,
      this.userIsMember$,
      this.userIsSubscribed$,
      this.lowestSupportTier$,
    ]).pipe(
      map(
        ([isOwner, isMember, isSubscribed, tier]) =>
          !isOwner && ((tier && !isMember) || (!tier && !isSubscribed))
      )
    );

    this.showLoginRow$ = combineLatest([
      this.isLoggedIn$,
      this.isOwner$,
      this.userIsMember$,
      this.showJoinButton$,
    ]).pipe(
      map(
        ([isLoggedIn, isOwner, isMember, showJoinButton]) =>
          isOwner || isMember || !isLoggedIn || showJoinButton
      )
    );
  }

  listen() {
    this.isLoggedInSubscription = this.session.loggedinEmitter.subscribe(
      (is) => {
        if (is) {
          this.isLoggedIn$.next(true);
          this.showSplash$.next(false);

          if (
            this.session.getLoggedInUser().guid === this.currentChannel.guid
          ) {
            this.isOwner$.next(true);
          }
        } else {
          this.isLoggedIn$.next(false);
          this.isOwner$.next(false);

          if (this.currentChannel) {
            this.currentChannel.subscribed = false;
          }
        }
      }
    );
  }

  ngOnDestroy() {
    this.isLoggedInSubscription.unsubscribe();
  }

  async load(id: string): Promise<MindsUser> {
    try {
      this.currentChannel = void 0;

      const response = (await this.client.get(`api/v2/pro/channel/${id}`)) as {
        channel;
      };

      this.currentChannel = response.channel;

      if (!this.currentChannel.pro_settings.tag_list) {
        this.currentChannel.pro_settings.tag_list = [];
      }

      this.onChannelChange.next(this.currentChannel);

      this.featuredContent = null;

      this.setFavicon();

      return this.currentChannel;
    } catch (e) {
      if (e.status === 0) {
        throw new Error('Connectivity error. Are you offline?');
      } else {
        throw new Error(e.message || 'There was an issue loading this channel');
      }
    }
  }

  async reload(id: string) {
    try {
      const response = (await this.client.get(`api/v2/pro/channel/${id}`)) as {
        channel;
      };

      this.currentChannel = response.channel;
      this.onChannelChange.next(this.currentChannel);

      return this.currentChannel;
    } catch (e) {
      if (e.status === 0) {
        throw new Error('Network error');
      } else {
        throw new Error('Error loading channel');
      }
    }
  }

  getRouterLink(to: RouterLinkToType, params?: { [key: string]: any }): any[] {
    let root = '/';

    if (this.route.parent) {
      root = this.route.parent.pathFromRoot
        .map((route) =>
          route.snapshot.url.map((urlSegment) => urlSegment.toString()).join('')
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

  open(entity) {
    switch (this.getEntityTaxonomy(entity)) {
      case 'group':
        window.open(`${this.site.baseUrl}group/${entity.guid}`, '_blank');
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
    this.userIsSubscribed$.next(true);

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
      this.userIsSubscribed$.next(false);
      this.toasterService.error(
        e.message || "You can't subscribe to this user"
      );
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

  wire() {
    // save into sessionStorage before doing the logged in check so the modal opens after logging in
    this.sessionStorage.set('pro::wire-modal::open', '1');

    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.session.getLoggedInUser().guid == this.currentChannel.guid) {
      return;
    }

    this.wireModal.present(this.currentChannel).then((payEvent) => {
      console.log({ payEvent });
      switch (payEvent.type) {
        case WireEventType.Completed:
          this.sessionStorage.destroy('pro::wire-modal::open');
          break;
        case WireEventType.Cancelled:
          this.sessionStorage.destroy('pro::wire-modal::open');
          break;
      }
    });

    this.analytics.send('pageview', {
      url: `/pro/${this.currentChannel.guid}/wire?ismodal=true`,
    });
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

  setFavicon(): void {
    if (!this.currentChannel) {
      return;
    }

    const href = this.currentChannel.pro_settings.logo_image;
    this.metaService.setDynamicFavicon(href);
  }
}
