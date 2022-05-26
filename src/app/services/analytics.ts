import {
  Inject,
  Injectable,
  OnDestroy,
  PLATFORM_ID,
  RendererFactory2,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Client } from './api/client';
import { SiteService } from '../common/services/site.service';
import { isPlatformServer } from '@angular/common';
import { CookieService } from '../common/services/cookie.service';
import { Session } from './session';
import * as snowplow from '@snowplow/browser-tracker';
import { SelfDescribingJson } from '@snowplow/tracker-core';
import { MindsUser } from './../interfaces/entities';
import { ActivityEntity } from './../modules/newsfeed/activity/activity.service';

export type SnowplowContext = SelfDescribingJson<Record<string, unknown>>;

@Injectable()
export class AnalyticsService implements OnDestroy {
  private defaultPrevented: boolean = false;

  contexts: SnowplowContext[] = [];

  unlistenDocumentClickEventListener: () => void;

  constructor(
    public router: Router,
    public client: Client,
    public site: SiteService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cookieService: CookieService,
    private sessionService: Session,
    private rendererFactory2: RendererFactory2
  ) {
    this.initSnowplow();

    this.onRouterInit();

    this.router.events.subscribe(navigationState => {
      if (navigationState instanceof NavigationEnd) {
        try {
          this.onRouteChanged(navigationState.urlAfterRedirects);
        } catch (e) {
          console.error('Minds: router hook(AnalyticsService)', e);
        }
      }
    });

    this.sessionService.loggedinEmitter?.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.initPseudoId();
      }
    });

    /**
     * We need access to the dom to record click events
     */
    const renderer = this.rendererFactory2.createRenderer(null, null);
    this.unlistenDocumentClickEventListener = renderer.listen(
      'document',
      'click',
      this.onDocumentClick.bind(this)
    );
  }

  ngOnDestroy() {
    if (this.unlistenDocumentClickEventListener)
      this.unlistenDocumentClickEventListener();
  }

  initSnowplow() {
    if (isPlatformServer(this.platformId)) return;
    const snowplowUrl = 'https://sp.minds.com'; // Todo: allow config service to configure this

    snowplow.newTracker('ma', snowplowUrl, {
      appId: 'minds',
      postPath: '/com.minds/t',
    });

    snowplow.enableActivityTracking({
      minimumVisitLength: 30,
      heartbeatDelay: 10,
    });
    this.initPseudoId();
  }

  async send(type: string, fields: any = {}, entityGuid: string = null) {
    if (isPlatformServer(this.platformId)) return; // Client side does these. Don't call twice
    if (type === 'pageview') {
      this.client.post('api/v2/mwa/pv', fields);

      snowplow.trackPageView({
        context: this.getContexts(),
      });
    } else {
      this.client.post('api/v1/analytics', { type, fields, entityGuid });
    }
  }

  /**
   * Called anytime a click event happens.
   * If a data-ref is located in the tree, it is recorded.
   * @param event
   * @returns void
   */
  onDocumentClick(event: MouseEvent): void {
    const el: HTMLElement = event?.target as HTMLElement;
    const dataRef = el?.closest('[data-ref]');

    const dataRefVal = dataRef?.getAttribute('data-ref');

    if (!dataRef) return; // We couldn't find a data-ref so nothing more to do here

    this.trackClick(dataRefVal);
  }

  /**
   * Tracks a click event
   * @param ref a string identifying the source of the click action
   * @returns { void }
   */
  trackClick(ref: string): void {
    snowplow.trackSelfDescribingEvent({
      event: {
        schema: 'iglu:com.minds/click_event/jsonschema/1-0-0',
        data: {
          ref,
        },
      },
      context: this.getContexts(),
    });
  }

  /**
   * Tracks an entity view event
   * @returns { void }
   */
  public trackView(entity: ActivityEntity | MindsUser, clientMeta = {}): void {
    snowplow.trackSelfDescribingEvent({
      event: {
        schema: 'iglu:com.minds/view/jsonschema/1-0-0',
        data: {
          entity_guid: entity.guid,
          // @ts-ignore
          entity_owner_guid: entity.owner_guid || entity.ownerObj?.guid,
          ...clientMeta,
        },
      },
      context: this.getContexts(),
    });
  }

  async onRouterInit() {}

  onRouteChanged(path) {
    if (!this.defaultPrevented) {
      let url = path;

      if (this.site.isProDomain) {
        url = `/pro/${this.site.pro.user_guid}${url}`;
      }

      this.send('pageview', {
        url,
        referrer: document.referrer,
      });
    }

    this.defaultPrevented = false;
  }

  preventDefault() {
    this.defaultPrevented = true;
  }

  wasDefaultPrevented() {
    return this.defaultPrevented;
  }

  /**
   * Will return global contexts or undefined
   * @returns SnowplowContext[]
   */
  getContexts(): SnowplowContext[] {
    return this.contexts.length > 0 ? this.contexts.slice(0) : undefined;
  }

  /**
   * Set a psuedonymous id, if one is available
   * This one-way id is created on login and only available to user
   */
  initPseudoId(): void {
    if (this.pseudoId) snowplow.setUserId(this.pseudoId);
  }

  /**
   * Returns a pseudoId from a cookie value
   */
  private get pseudoId(): string {
    return this.cookieService.get('minds_pseudoid');
  }
}
