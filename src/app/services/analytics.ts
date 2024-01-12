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
import { ActivityEntity } from '../modules/newsfeed/activity/activity.service';
import { ConfigsService } from '../common/services/configs.service';

export type SnowplowContext = SelfDescribingJson<Record<string, unknown>>;

// entity that can be contextualized into an 'entity_context'.
export type ContextualizableEntity = {
  guid: string;
  type: string;
  subtype: string;
  access_id: string;
  container_guid: string;
  owner_guid: string;
};

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
    private rendererFactory2: RendererFactory2,
    private configService: ConfigsService
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

    let appId = 'minds';

    if (this.configService.get('tenant_id')) {
      appId = 'minds-tenant-' + this.configService.get('tenant_id');
    }

    snowplow.newTracker('ma', snowplowUrl, {
      appId: appId,
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
   * Tracks a click event.
   * @param { string } ref - a string identifying the source of the click action.
   * @param { SnowplowContext[] } contexts - additional contexts.
   * @returns { void }
   */
  public trackClick(ref: string, contexts: SnowplowContext[] = []): void {
    return this.trackGenericEvent('click', ref, contexts);
  }

  /**
   * Tracks a generic view event.
   * @param { string } ref - a string identifying the source of the click action.
   * @param { SnowplowContext[] } contexts - additional contexts.
   * @returns { void }
   */
  public trackView(ref: string, contexts: SnowplowContext[] = []): void {
    return this.trackGenericEvent('view', ref, contexts);
  }

  /**
   * Build entity context for a given entity.
   * @param { ContextualizableEntity } entity - entity to build entity_context for.
   * @returns { SnowplowContext } - built entity_context.
   */
  public buildEntityContext(entity: ContextualizableEntity): SnowplowContext {
    return {
      schema: 'iglu:com.minds/entity_context/jsonschema/1-0-0',
      data: {
        entity_guid: entity.guid ?? null,
        entity_type: entity.type ?? null,
        entity_subtype: entity.subtype ?? null,
        entity_owner_guid: entity.owner_guid ?? null,
        entity_access_id: entity.access_id ?? null,
        entity_container_guid: entity.container_guid ?? null,
      },
    };
  }

  /**
   * Tracks an entity view event
   * @returns { void }
   */
  public trackEntityView(
    entity: ActivityEntity | MindsUser,
    clientMeta = {}
  ): void {
    snowplow.trackSelfDescribingEvent({
      event: {
        schema: 'iglu:com.minds/view/jsonschema/1-0-0',
        data: {
          entity_guid: entity.guid,
          entity_type: entity.type ?? null,
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
   * Note: tenants will set their user id
   */
  initPseudoId(): void {
    let userId;

    if (this.configService.get('is_tenant')) {
      userId = this.sessionService.getLoggedInUser().guid;
    } else if (this.pseudoId) {
      userId = this.pseudoId;
    }

    if (userId) {
      snowplow.setUserId(userId);
    }
  }

  /**
   * Returns a pseudoId from a cookie value
   */
  private get pseudoId(): string {
    return this.cookieService.get('minds_pseudoid');
  }

  /**
   * Tracks a generic event.
   * @param { string } eventType - the type of this event e.g. view, click, etc.
   * @param { string } eventRef - a string identifying the source of this action.
   * @param  { SnowplowContext[] } contexts
   */
  private trackGenericEvent(
    eventType: string,
    eventRef: string,
    contexts: SnowplowContext[] = []
  ): void {
    snowplow.trackSelfDescribingEvent({
      event: {
        schema: 'iglu:com.minds/generic_event/jsonschema/1-0-0',
        data: {
          event_type: eventType,
          event_ref: eventRef,
        },
      },
      context: [...(this.getContexts() ?? []), ...contexts],
    });
  }
}
