import { isPlatformServer } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { lastValueFrom, Subscription } from 'rxjs';
import { MindsUser } from '../../../interfaces/entities';
import { Session } from '../../../services/session';
import { ApiService } from '../../api/api.service';
import { ConfigsService } from '../../services/configs.service';
import { UserAvatarService } from '../../services/user-avatar.service';
import {
  ChatwootHmacGetResponse,
  ChatwootMindsConfig,
} from './chatwoot-widget.types';
import { IS_TENANT_NETWORK } from '../../injection-tokens/tenant-injection-tokens';
import { ChatwootWidgetService } from './chatwoot-widget.service';

/**
 * Chatwoot widget - injects a script into the DOM that loads the widget.
 */
@Component({
  selector: 'm-chatwootWidget',
  template: ``,
  styleUrls: ['./chatwoot-widget.component.ng.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatwootWidgetComponent implements OnInit, OnDestroy {
  /** website token for chatwoot */
  private readonly websiteToken: string;

  /** base url for chatwoot */
  private readonly baseUrl: string;

  /** url of script to load to init chatwoot */
  private readonly scriptUrl: string;

  /** subscription to login and logout states */
  private loggedInSubscription: Subscription;

  /** subscription to login and logout states handling chatwoot init. */
  private loggedInInitSubscription: Subscription;

  constructor(
    private session: Session,
    private api: ApiService,
    private config: ConfigsService,
    private userAvatar: UserAvatarService,
    private service: ChatwootWidgetService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(IS_TENANT_NETWORK) private readonly isTenantNetwork: boolean
  ) {
    const chatwootConfig: ChatwootMindsConfig =
      this.config.get<ChatwootMindsConfig>('chatwoot');
    this.websiteToken = chatwootConfig.website_token;
    this.baseUrl = chatwootConfig.base_url;
    this.scriptUrl = '/static/en/assets/scripts/chatwoot.js';
  }

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    if (this.service.canUseChatwoot()) {
      this.initChatwoot();
    } else {
      this.loggedInInitSubscription = this.session.loggedinEmitter.subscribe(
        (loggedIn: boolean): void => {
          if (
            this.service.canUseChatwoot() &&
            (!(window as any).$chatwoot || !(window as any).$chatwoot?.isLoaded)
          ) {
            this.initChatwoot();
          }
        }
      );
    }
  }

  ngOnDestroy(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    this.resetChatwoot();
    this.loggedInSubscription?.unsubscribe();
    this.loggedInInitSubscription?.unsubscribe();
  }

  /**
   * Initialize chatwoot, injecting script into the DOM, configuring
   * and setting up listeners.
   * @returns { void }
   */
  private initChatwoot(): void {
    // grab existing script elements
    const firstScriptElement: HTMLScriptElement =
      document.getElementsByTagName('script')[0];

    // create new script element
    let newScriptElement: HTMLScriptElement = document.createElement('script');
    newScriptElement.src = this.scriptUrl;
    newScriptElement.defer = true;
    newScriptElement.async = true;

    // add new script element to DOM
    firstScriptElement.parentNode.insertBefore(
      newScriptElement,
      firstScriptElement
    );

    // attach on load listener for script to init chatwoot.
    newScriptElement.onload = (): void => {
      this.onChatwootLoad();
    };
  }

  /**
   * Fires on Chatwoot load.
   */
  private onChatwootLoad(): void {
    // init with chatwoot settings.
    this.setChatwootSettings();

    // run chatwoot widget
    (window as any).chatwootSDK.run({
      websiteToken: this.websiteToken,
      baseUrl: this.baseUrl,
    });

    window.addEventListener('chatwoot:error', function (e) {
      console.error(e);
    });

    window.addEventListener('chatwoot:ready', (ready) => {
      if (this.session.isLoggedIn()) {
        this.setUser();
      } else {
        // if logged out, reset chatwoot to ensure there is no lingering state.
        this.resetChatwoot();
      }

      this.initLoginStateSubscription();
    });
  }

  /**
   * Sets user for widget.
   * @returns { Promise<void> }
   */
  private async setUser(): Promise<void> {
    const user: MindsUser = this.session.getLoggedInUser();

    (window as any).$chatwoot.setUser(user.guid, {
      name: `@${user.username}`,
      identifier_hash: await this.getIdentifierHash(),
      avatar_url: this.userAvatar.getSrc(),
    });
  }

  /**
   * Gets identifier hash (user HMAC for chatwoot) from the server.
   * @returns { Promise<string> } return identifier hash.
   */
  private async getIdentifierHash(): Promise<string> {
    let response: ChatwootHmacGetResponse = await lastValueFrom(
      this.api.get<ChatwootHmacGetResponse>('/api/v3/helpdesk/chatwoot/hmac')
    );
    return response.hmac;
  }

  /**
   * Reset chatwoot. Should be called on logout.
   * @returns { void }
   */
  private resetChatwoot(): void {
    (window as any).$chatwoot?.reset();
  }

  /**
   * Sets chatwoot settings.
   * @returns { void }
   */
  private setChatwootSettings(): void {
    (window as any).chatwootSettings = {
      locale: 'en',
      darkMode: 'light',
    };
  }

  /**
   * Init login/logout state subscription. Will set user on login
   * and reset user on logout.
   * @returns { void }
   */
  private initLoginStateSubscription(): void {
    if (this.loggedInSubscription) {
      console.warn('Attempted to reinitialize login subscription for Chatwoot');
      return;
    }
    this.loggedInSubscription = this.session.loggedinEmitter.subscribe(
      (loggedIn: boolean): void => {
        if (this.isTenantNetwork) {
          if (loggedIn && this.service.canUseChatwoot()) {
            this.service.showBubble();
          } else {
            this.service.hideBubble();
          }
        }

        if (loggedIn) {
          this.setUser();
          return;
        }
        this.resetChatwoot();
      }
    );
  }
}
