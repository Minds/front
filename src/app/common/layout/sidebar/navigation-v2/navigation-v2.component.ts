import {
  Component,
  HostBinding,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  OnDestroy,
  Injector,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Navigation as NavigationService } from '../../../../services/navigation';
import { Session } from '../../../../services/session';
import { DynamicHostDirective } from '../../../directives/dynamic-host.directive';
import { SidebarNavigationService } from '../navigation.service';
import { ConfigsService } from '../../../services/configs.service';
import { Observable, Subscription, of } from 'rxjs';
import { Router, NavigationEnd, Event } from '@angular/router';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { ComposerModalService } from '../../../../modules/composer/components/modal/modal.service';
import { ThemeService } from '../../../services/theme.service';
import { ComposerService } from '../../../../modules/composer/services/composer.service';
import { AuthModalService } from '../../../../modules/auth/modal/auth-modal.service';
import { ExperimentsService } from '../../../../modules/experiments/experiments.service';
import { IS_TENANT_NETWORK } from '../../../injection-tokens/tenant-injection-tokens';
import { PermissionsService } from '../../../services/permissions.service';
import { MultiTenantConfigImageService } from '../../../../modules/multi-tenant-network/services/config-image.service';
import { SiteMembershipsCountService } from '../../../../modules/site-memberships/services/site-membership-count.service';
import {
  NavigationItem,
  PermissionsEnum,
} from '../../../../../graphql/generated.engine';

export type NavigationItemExtended = NavigationItem & {
  mustBeLoggedIn?: boolean;
  routerLinkActiveExact?: boolean;
};
import { ChatExperimentService } from '../../../../modules/experiments/sub-services/chat-experiment.service';
import { ChatReceiptService } from '../../../../modules/chat/services/chat-receipt.service';
import { PermissionIntentsService } from '../../../services/permission-intents.service';

/**
 * V2 version of sidebar component.
 */
@Component({
  selector: 'm-sidebar__navigationV2',
  templateUrl: 'navigation-v2.component.html',
  styleUrls: ['./navigation-v2.component.ng.scss'],
})
export class SidebarNavigationV2Component implements OnInit, OnDestroy {
  /** Enum for use in template. */
  protected PermissionsEnum: typeof PermissionsEnum = PermissionsEnum;

  readonly cdnUrl: string;
  readonly cdnAssetsUrl: string;
  readonly chatUrl: string;

  @ViewChild(DynamicHostDirective, { static: true })
  host: DynamicHostDirective;

  user;

  componentRef;

  layoutMode: 'phone' | 'tablet' | 'desktop' = 'desktop';
  showLabels: boolean = false;

  settingsLink: string = '/settings';

  @HostBinding('class.m-sidebarNavigation--opened')
  isOpened: boolean = false;

  @HostBinding('hidden')
  hidden: boolean = false;

  @HostBinding('class.m-sidebarNavigation--sidebarMoreOpened')
  sidebarMoreOpened: boolean = false;

  groupSelectedSubscription: Subscription = null;
  plusPageActive: boolean = false;

  subscriptions: Subscription[] = [];

  /** Whether chat experiment is active. */
  private unreadChatCountSubscription: Subscription;

  isDarkTheme: boolean = false;

  // Becomes true when the discovery link is clicked.
  // Used to determine whether to show 'new content dot'
  discoveryLinkClicked: boolean = false;

  protected chatExperimentIsActive: boolean = false;

  /** Unread message count */
  public chatUnreadCount = 0;

  /** Whether experiment controlling reorganization of menu items variation is active */
  public showReorgVariation: boolean = false;

  /** Whether the user has permission to boost. */
  protected hasBoostPermission: boolean = false;

  /**
   * Sets display mode on resize.
   */
  @HostListener('window:resize')
  public onResize(): void {
    this.showLabels = window.innerWidth >= 1220 ? true : false;

    if (window.innerWidth > 1040) {
      this.layoutMode = 'desktop';
    } else if (window.innerWidth >= 480) {
      this.layoutMode = 'tablet';
    } else {
      this.layoutMode = 'phone';
      this.showLabels = true;
    }

    if (this.layoutMode !== 'phone') {
      this.sidebarNavigationService.isOpened$.next(false);
    }
  }

  constructor(
    public navigation: NavigationService,
    public session: Session,
    protected configs: ConfigsService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private composerService: ComposerService,
    private composerModalService: ComposerModalService,
    private injector: Injector,
    private themeService: ThemeService,
    private sidebarNavigationService: SidebarNavigationService,
    private authModal: AuthModalService,
    private experiments: ExperimentsService,
    private tenantConfigImageService: MultiTenantConfigImageService,
    protected permissions: PermissionsService,
    protected permissionIntentsService: PermissionIntentsService,
    private chatExperimentService: ChatExperimentService,
    private chatReceiptService: ChatReceiptService,
    @Inject(IS_TENANT_NETWORK) public readonly isTenantNetwork: boolean
  ) {
    this.cdnUrl = this.configs.get('cdn_url');
    this.cdnAssetsUrl = this.configs.get('cdn_assets_url');
    this.chatUrl = this.configs.get('matrix')?.chat_url;
    this.sidebarNavigationService.setContainer(this);
    this.getUser();
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.onResize();
    }

    this.settingsLink = '/settings';

    this.chatExperimentIsActive = this.chatExperimentService.isActive();

    this.hasBoostPermission = this.permissions.canBoost();

    this.subscriptions.push(
      this.session.loggedinEmitter.subscribe((isLoggedIn: boolean): void => {
        this.hasBoostPermission = this.permissions.canBoost();
      }),
      this.themeService.isDark$.subscribe((isDark) => {
        this.isDarkTheme = isDark;
      }),
      this.sidebarNavigationService.isOpened$.subscribe((isOpened) => {
        if (this.layoutMode === 'phone') {
          this.isOpened = isOpened;

          if (isOpened) {
            document.body.classList.add('m-overlay-modal--shown--no-scroll');
          }
        }

        if (this.layoutMode !== 'phone' || !isOpened) {
          document.body.classList.remove('m-overlay-modal--shown--no-scroll');
        }
      }),
      // Temporarily disable routerLinkActive class for the 'discovery' item so only 'discovery/plus' is highlighted.
      this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe((event: Event) => {
          if (event['url'].slice(0, 15) === '/discovery/plus') {
            this.plusPageActive = true;
          } else {
            this.plusPageActive = false;
          }
        })
    );

    if (this.chatExperimentIsActive) {
      this.subscriptions.push(
        this.session.loggedinEmitter.subscribe((isLoggedIn: boolean) => {
          if (isLoggedIn) {
            this.initUnreadChatCountSubscription();
          } else {
            this.unreadChatCountSubscription?.unsubscribe();
            this.unreadChatCountSubscription = null;
          }
        })
      );

      if (isPlatformBrowser(this.platformId) && this.isLoggedIn()) {
        this.initUnreadChatCountSubscription();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.groupSelectedSubscription) {
      this.groupSelectedSubscription.unsubscribe();
    }

    if (this.chatExperimentIsActive && this.unreadChatCountSubscription) {
      this.unreadChatCountSubscription?.unsubscribe();
      this.unreadChatCountSubscription = null;
    }

    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Gets user and sets it to class variable.
   * @returns { void }
   */
  public getUser(): void {
    this.user = this.session.getLoggedInUser((user) => {
      this.user = user;
    });
  }

  /**
   * Whether session logged in user is an admin.
   * @returns { boolean } true if user is an admin.
   */
  public isAdmin(): boolean {
    return this.session.isAdmin();
  }

  /**
   * Whether the user is logged in
   * @returns { boolean } true if logged in
   */
  public isLoggedIn(): boolean {
    return this.session.isLoggedIn();
  }

  /**
   * Toggles sidebar being open on mobile.
   * @returns { void }
   */
  public toggle(): void {
    this.sidebarNavigationService.toggle();
  }

  /**
   * Open composer modal.
   * @returns { Promise<void> }
   */
  public async openComposeModal(): Promise<void> {
    if (!this.isLoggedIn()) {
      this.authModal.open();
      return;
    }

    this.toggle();
    // required so that the sidebar doesn't get stuck in the context
    // of another instantiated composer, for example within a group,
    // where it will pick up the container guid.
    this.composerService.reset();

    await this.composerModalService.setInjector(this.injector).present();
  }

  /**
   * Set visible state.
   * @param { boolean } value - value to set visibility state to.
   * @returns { void }
   */
  public setVisible(value: boolean): void {
    this.hidden = !value;
    if (!value) {
      if (this.host && this.host.viewContainerRef) {
        this.host.viewContainerRef.clear();
      }
    }
  }

  /**
   * Don't click through the menu on mobile.
   * @returns { void }
   */
  public onSidebarNavClick($event): void {
    if (this.layoutMode === 'phone') {
      $event.stopPropagation();
    }
  }

  /**
   * Returns if link should be to discovery homepage
   * @returns { boolean } true if link should be '/'.
   */
  public shouldBeDiscoveryHomepage(): boolean {
    return !this.user && this.isTenantNetwork; // logged out tenants
  }

  /**
   *
   * We dynamically change the z-index when the
   * "sidebar more" float-ui is opened
   * So that users can still click on the top left logo
   * when the float-ui is closed.
   * @param $event
   * @returns { void }
   */
  public onSidebarMoreToggle($event): void {
    this.sidebarMoreOpened = $event;
  }

  /**
   * Gets logo src depending on whether we're on a multi-tenant network and if the
   * user is in dark / light mode.
   * @param { 'dark' | 'light' } mode - dark or light mode.
   * @returns { Observable<string> } - observable of logo src.
   */
  public getLogoSrc$(mode: 'light' | 'dark'): Observable<string> {
    if (!this.isTenantNetwork) {
      return of(
        `${this.cdnAssetsUrl}assets/logos/` +
          (mode === 'light' ? 'medium-production.png' : 'medium-white.png')
      );
    }
    return this.tenantConfigImageService.horizontalLogoPath$;
  }

  /**
   * Initializes the unread chat count subscription.
   * @returns { void }
   */
  private initUnreadChatCountSubscription(): void {
    if (this.unreadChatCountSubscription) {
      console.warn('Unread chat count subscription already initialized');
      return;
    }

    this.unreadChatCountSubscription =
      this.chatReceiptService.unreadCount$.subscribe((count: number) => {
        this.chatUnreadCount = count;
      });
  }
}
