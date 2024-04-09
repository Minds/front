import {
  Inject,
  Injectable,
  OnDestroy,
  PLATFORM_ID,
  RendererFactory2,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Client } from './api/client';
import { SiteService } from '../common/services/site.service';
import { isPlatformServer } from '@angular/common';
import { CookieService } from '../common/services/cookie.service';
import { Session } from './session';

import posthog, { Properties } from 'posthog-js';

import { MindsUser } from './../interfaces/entities';
import { ActivityEntity } from '../modules/newsfeed/activity/activity.service';
import { ConfigsService } from '../common/services/configs.service';

export type SnowplowContext = any;

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
  private hasBeenLoggedIn = false;

  contexts: SnowplowContext[] = [];

  unlistenDocumentClickEventListener: () => void;

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public client: Client,
    public site: SiteService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private sessionService: Session,
    private rendererFactory2: RendererFactory2,
    private configService: ConfigsService
  ) {
    this.initPostHog();

    this.router.events.subscribe(navigationState => {
      if (navigationState instanceof NavigationEnd) {
        try {
          this.onRouteChanged(navigationState.urlAfterRedirects);
        } catch (e) {
          console.error('Minds: router hook(AnalyticsService)', e);
        }
      }
    });

    /**
     * On login event, let posthog know our new identity
     */
    this.sessionService.loggedinEmitter.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.setUser(this.sessionService.getLoggedInUser());
        this.hasBeenLoggedIn = true;
      } else if (this.hasBeenLoggedIn) {
        // If the user was previously logged in, we can reset
        // If a user is opted out, they should still be when logged out too
        const isOptOut = this.configService.get('posthog')['opt_out'];
        posthog.reset();
        if (isOptOut) {
          posthog.opt_out_capturing();
        }
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

  /**
   * Setup posthog, with the server side evaluated flags
   */
  initPostHog() {
    const featureFlags = this.configService.get('posthog')['feature_flags'];
    posthog.init(this.configService.get('posthog')['api_key'], {
      api_host: this.configService.get('posthog')['host'],
      capture_pageview: false, // Do not send initial pageview, angular will
      autocapture: false, // Disable auto-capture by default
      advanced_disable_feature_flags: true, // We provide these from our backend
      bootstrap: {
        featureFlags,
      },
    });
    this.setUser(this.sessionService.getLoggedInUser());
  }

  /**
   * Set if a user has disabled analytics or not
   */
  public setOptOut(optOut: boolean): void {
    const posthostConfig = this.configService.get('posthog');
    posthostConfig.opt_out = optOut;
    this.configService.set('posthog', posthostConfig);
  }

  /**
   * Set the currently logged in user so we can identify them
   */
  public setUser(user: MindsUser): void {
    if (!user) return;

    // Check (from configs) if we have opted out of analytics
    if (this.configService.get('posthog')['opt_out']) {
      posthog.opt_out_capturing();
    } else {
      if (posthog.has_opted_out_capturing()) {
        posthog.clear_opt_in_out_capturing();
      }
    }

    // Call once per session
    posthog.identify(user.guid);
  }

  async send(type: string, fields: any = {}, entityGuid: string = null) {
    if (isPlatformServer(this.platformId)) return; // Client side does these. Don't call twice
    if (type === 'pageview') {
      this.capture('$pageview');
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
    // We are not sending to posthog at the minute
  }

  onRouteChanged(path) {
    if (!this.defaultPrevented) {
      let url = path;

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
    const properties = {};

    for (let context of contexts) {
      if (context.schema === 'iglu:com.minds/entity_context/jsonschema/1-0-0') {
        properties['entity_guid'] = context.data.entity_guid;
        properties['entity_type'] = context.data.entity_type;
        properties['entity_subtype'] = context.data.entity_subtype;
        properties['entity_owner_guid'] = context.data.entity_owner_guid;
      }
    }

    this.capture(`dataref_${eventType}`, {
      ref: eventRef,
      ...properties,
    });
  }

  /**
   * Wrapper around posthog.capture
   * @param eventName
   * @param properties
   */
  private capture(eventName: string, properties?: Properties): void {
    properties = properties || {};
    const $setOnce = properties.$set_once || {};
    const $set = properties.$set || {};

    // Group together similar pages by the ng route
    const ng_tokenized_path = this.activatedRoute.snapshot.firstChild
      ?.routeConfig?.path;
    if (ng_tokenized_path) {
      properties.ng_tokenized_path = ng_tokenized_path;
    }

    // If this is a tenant, add the tenant id
    const tenantId = this.configService.get('tenant_id');
    if (tenantId) {
      $setOnce.tenant_id = tenantId;
      properties.tenant_id = tenantId;
    }

    // Set the current environment
    $set.environment = this.configService.get('environment');
    properties.environment = this.configService.get('environment');

    if (Object.keys($set).length) {
      properties.$set = $set;
    }

    if (Object.keys($setOnce).length) {
      properties.$set_once = $setOnce;
    }

    posthog.capture(eventName, properties);
  }
}
