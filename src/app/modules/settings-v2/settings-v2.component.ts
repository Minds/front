import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NestedMenu } from '../../common/layout/nested-menu/nested-menu.component';
import { Session } from '../../services/session';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SettingsV2Service } from './settings-v2.service';
import { ToasterService } from '../../common/services/toaster.service';
import { ProService } from '../pro/pro.service';
import { Subscription } from 'rxjs';
import { IsTenantService } from '../../common/services/is-tenant.service';
import { PermissionsService } from '../../common/services/permissions.service';
import { PermissionsEnum } from '../../../graphql/generated.engine';
import { isPlatformBrowser } from '@angular/common';

/**
 * Container that determines what form/menu(s)
 * should be displayed in the settings-v2 module
 */
@Component({
  selector: 'm-settingsV2',
  templateUrl: './settings-v2.component.html',
})
export class SettingsV2Component implements OnInit {
  init: boolean = false;
  secondaryPaneIsMenu: boolean = false;
  standardHeader: boolean = true;
  menuHeaderId: string = 'account';
  routeData: any;
  user: string | null = null;
  onMainNav: boolean = false;

  // True if there is no secondary menu for this item
  // e.g. affiliates program
  singleLevelMenuId: string;

  protected paramMap$: Subscription;

  mainMenus: NestedMenu[] = [
    {
      header: {
        label: $localize`:@@SETTINGS__HEADER__LABEL:Settings`,
        id: 'settings',
      },
      items: [
        {
          label: $localize`:@@SETTINGS__ACCOUNT__LABEL:Account`,
          id: 'account',
        },
        {
          label: $localize`:@@SETTINGS__PLUS__LABEL:Minds+`,
          id: 'plus',
          shouldShow: this.isPlusUser.bind(this),
        },
        {
          label: $localize`:@@SETTINGS__PRO__LABEL:Pro`,
          id: 'pro_canary', // :user param added later
          shouldShow: this.isNotTenantSite.bind(this),
        },
        {
          label: $localize`:@@SETTINGS__SECURITY__LABEL:Security`,
          id: 'security',
        },
        {
          label: $localize`:@@SETTINGS__PAYMENTS__LABEL:Payments`,
          id: 'payments',
          shouldShow: this.isNotTenantSite.bind(this),
        },
        {
          label: $localize`:@@SETTINGS__AFFILIATES_PROGRAM__LABEL:Affiliates Program`,
          id: 'affiliates-program',
          shouldShow: this.isNotTenantSite.bind(this),
        },
        { label: $localize`:@@SETTINGS__OTHER__LABEL:Other`, id: 'other' },
      ],
    },
  ];

  secondaryMenus: {
    [key: string]: NestedMenu[];
  } = {
    account: [
      {
        header: {
          label: $localize`:@@SETTINGS__ACCOUNT__HEADER__LABEL:General Account Settings`,
          id: 'account',
        },
        items: [
          {
            label: $localize`:@@SETTINGS__ACCOUNT__PROFILE__LABEL:Profile`,
            id: 'profile',
          },
          {
            label: $localize`:@@SETTINGS__ACCOUNT__EMAIL__LABEL:Email Address`,
            id: 'email-address',
          },
          {
            label: $localize`:@@SETTINGS__ACCOUNT__LANGUAGE__LABEL:Language`,
            id: 'language',
            shouldShow: this.isNotTenantSite.bind(this),
          },
          {
            label: $localize`:@@SETTINGS__ACCOUNT__PASSWORD__LABEL:Password`,
            id: 'password',
          },
          {
            label: $localize`:@@SETTINGS__ACCOUNT__BOOST__LABEL:Boosted Content`,
            id: 'boosted-content',
            shouldShow: this.isNotTenantSite.bind(this),
          },
          {
            label: $localize`:@@SETTINGS__ACCOUNT__NSFW__LABEL:NSFW Content`,
            id: 'nsfw-content',
          },
          {
            label: $localize`:@@SETTINGS__ACCOUNT__SHAREBUTTONS__LABEL:Share Buttons`,
            id: 'share-buttons',
          },
          {
            label: $localize`:@@SETTINGS__ACCOUNT__AUTOPLAY__LABEL:Autoplay Videos`,
            id: 'autoplay-videos',
          },
          {
            label: $localize`:@@SETTINGS__ACCOUNT__MESSENGER__LABEL:Messenger`,
            id: 'messenger',
            shouldShow: this.isNotTenantSite.bind(this),
          },
          {
            label: $localize`:@@SETTINGS__ACCOUNT__NOSTR__LABEL:Nostr`,
            id: 'nostr',
            shouldShow: this.isNotTenantSite.bind(this),
          },
          {
            label: $localize`:@@SETTINGS__ACCOUNT__USERDATA__LABEL:User Data & Analytics`,
            id: 'user-data',
          },
        ],
      },
      {
        header: {
          label: $localize`:@@SETTINGS__NOTIFICATIONS__HEADER__LABEL:Notifications`,
          id: 'notifications',
        },
        items: [
          {
            label: 'Push Notifications',
            id: 'push-notifications',
            route: null,
            shouldShow: null,
          },
          {
            label: 'Email Notifications',
            id: 'email-notifications',
            route: null,
            shouldShow: null,
          },
        ],
      },
      {
        header: {
          label: $localize`:@@SETTINGS__ACCOUNTUPGRADE__HEADER__LABEL:Account Upgrade`,
          id: 'account-upgrade',
        },
        shouldShow: this.shouldShowUpgradesMenu.bind(this),
        items: [
          {
            label: $localize`:@@SETTINGS__ACCOUNTUPGRADE__PRO__LABEL:Upgrade to Pro`,
            id: 'upgrade-to-pro',
            route: '/pro',
            shouldShow: this.isNotProUser.bind(this),
          },
          {
            label: $localize`:@@SETTINGS__ACCOUNTUPGRADE__PLUS__LABEL:Upgrade to Plus`,
            id: 'upgrade-to-plus',
            route: '/plus',
            shouldShow: this.isNotPlusUser.bind(this),
          },
        ],
      },
    ],
    security: [
      {
        header: {
          label: $localize`:@@SETTINGS__SECURITY__HEADER__LABEL:Security`,
          id: 'security',
        },
        items: [
          {
            label: $localize`:@@SETTINGS__SECURITY__2FA__LABEL:Two-factor Authentication`,
            id: 'two-factor',
          },
          {
            label: $localize`:@@SETTINGS__SECURITY__SESSIONS__LABEL:Sessions`,
            id: 'sessions',
          },
          {
            label: $localize`:@@SETTINGS__SECURITY__PERSONAL_API_KEYS__LABEL:Personal API Keys`,
            id: 'api-keys',
            shouldShow: () => this.session.isAdmin(),
          },
        ],
      },
    ],
    payments: [
      {
        header: {
          label: $localize`:@@SETTINGS__PAYMENTS__HEADER__LABEL:Payments`,
          id: 'payments',
        },
        items: [
          {
            label: $localize`:@@SETTINGS__PAYMENTS__METHOD__LABEL:Payment Methods`,
            id: 'payment-methods',
          },
          {
            label: $localize`:@@SETTINGS__PAYMENTS__METHOD__LABEL:Payment History`,
            id: 'payment-history',
          },
          {
            label: $localize`:@@SETTINGS__PAYMENTS__RECURRING__LABEL:Recurring Payments`,
            id: 'recurring-payments',
          },
          {
            label: $localize`:@@SETTINGS__SUPERMIND__HEADER__LABEL:Supermind`,
            id: 'supermind',
          },
        ],
      },
    ],

    plus: [
      {
        shouldShow: this.isPlusUser.bind(this),
        header: {
          label: $localize`:@@SETTINGS__PLUS__HEADER__LABEL:Minds+ Settings`,
          id: 'plus',
        },
        items: [
          {
            label: $localize`:@@SETTINGS__PLUS__VERIFY__LABEL:Verify Your Account`,
            id: 'verify',
          },
          // {
          //   shouldShow: this.isNotProUser.bind(this),
          //   label: $localize`:@@SETTINGS__PLUS__CANCEL__LABEL:Cancel Minds+ Subscription`,
          //   id: 'cancel',
          // },
        ],
      },
    ],

    pro_canary: [
      {
        shouldShow: this.isNotTenantSite.bind(this),
        header: {
          label: $localize`:@@SETTINGS__PRO__HEADER__LABEL:Pro Settings`,
          id: 'pro_canary',
        },
        items: [
          {
            label: $localize`:@@SETTINGS__PRO__PAYOUTS__LABEL:Payouts`,
            id: 'payouts',
          },
        ],
      },
      // {
      //   shouldShow: this.isNotTenantSite.bind(this),
      //   header: {
      //     label: $localize`:@@SETTINGS__PRO__SUBSCRIPTION__HEADER__LABEL:Pro Subscription Management`,
      //     id: 'pro-subscription',
      //   },
      //   items: [
      //     {
      //       label: $localize`:@@SETTINGS__PRO__SUBSCRIPTION__CANCEL__LABEL:Cancel Pro Subscription`,
      //       id: 'cancel',
      //     },
      //     {
      //       label: $localize`:@@SETTINGS__PRO__VIEW__CHANNEL__LABEL:View Pro Channel`,
      //       id: 'view-pro-channel',
      //       route: '',
      //     },
      //   ],
      // },
    ],
    other: [
      {
        shouldShow: this.isNotTenantSite.bind(this),
        header: {
          label: $localize`:@@SETTINGS__OTHER__PRIVACY__HEADER__LABEL:Privacy`,
          id: 'privacy',
        },
        items: [
          {
            label: $localize`:@@SETTINGS__OTHER__PRIVACY__WALLET__LABEL:Wallet`,
            id: 'wallet',
          },
        ],
      },
      {
        header: {
          label: $localize`:@@SETTINGS__OTHER__CONTENTADMIN__HEADER__LABEL:Content Admin`,
          id: 'content-admin',
        },
        items: [
          {
            label: $localize`:@@SETTINGS__OTHER__CONTENTADMIN__REPORTED__LABEL:Reported Content`,
            id: 'reported-content',
          },
          {
            label: $localize`:@@SETTINGS__OTHER__CONTENTADMIN__BLOCKED__LABEL:Blocked Channels`,
            id: 'blocked-channels',
          },
        ],
      },
      {
        shouldShow: this.isNotTenantSite.bind(this),
        header: {
          label: $localize`:@@SETTINGS__OTHER__PAIDCONTENT__HEADER__LABEL:Paid Content`,
          id: 'paid-content',
        },
        items: [
          {
            label: $localize`:@@SETTINGS__OTHER__PAIDCONTENT__SUBSCRIPTIONS__LABEL:Subscription Tier Management`,
            id: 'subscription-tiers',
          },
        ],
      },
      {
        header: {
          label: $localize`:@@SETTINGS__OTHER__CONTENTMIGRATION__HEADER__LABEL:Content Migration`,
          id: 'content-migration',
        },
        shouldShow: this.shouldShowContentMigrationHeader.bind(this),
        items: [
          {
            label: $localize`:@@SETTINGS__OTHER__CONTENTMIGRATION__YOUTUBE__LABEL:Youtube`,
            id: 'youtube-migration',
            shouldShow: this.isNotTenantSite.bind(this),
          },
          {
            label: $localize`:@@SETTINGS__OTHER__CONTENTMIGRATION__RSS_SYNC__LABEL:RSS Sync`,
            id: 'rss-sync',
            shouldShow: this.hasRssSyncPermission.bind(this),
          },
        ],
      },
      {
        header: {
          label: $localize`:@@SETTINGS__OTHER__PLUGINS__HEADER__LABEL:Plugins`,
          id: 'plugins',
        },
        items: [
          {
            label: $localize`:@@SETTINGS__OTHER__PLUIGINS__EMBEDDED_COMMENTS__LABEL:Embedded Comments`,
            id: 'embedded-comments',
          },
        ],
      },
      {
        header: {
          label: $localize`:@@SETTINGS__OTHER__LEAVE__HEADER__LABEL:Deactivate and Delete Account`,
          id: 'deactivate-account',
        },
        items: [
          {
            label: $localize`:@@SETTINGS__OTHER__LEAVE__DEACTIVATE__LABEL:Deactivate Account`,
            id: 'deactivate-account',
          },
          {
            label: $localize`:@@SETTINGS__OTHER__LEAVE__DELETE__LABEL:Delete Account`,
            id: 'delete-account',
          },
        ],
      },
    ],
  };

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    protected session: Session,
    protected settingsService: SettingsV2Service,
    protected proService: ProService,
    protected toasterService: ToasterService,
    private IsTenantService: IsTenantService,
    private permissionsService: PermissionsService,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.session.isLoggedIn()) {
        this.router.navigate(['/login'], { replaceUrl: true });
        return;
      }
    }
    this.user = this.session.getLoggedInUser().username;

    if (this.route.snapshot.url.length === 0) {
      this.router.navigateByUrl('/settings/account?ref=main', {
        skipLocationChange: true,
      });
    }

    this.route.queryParamMap.subscribe((params) => {
      this.onMainNav = params.get('ref') === 'main' ? true : false;
    });

    this.route.url.subscribe((url) => {
      if (url[0]) {
        this.menuHeaderId = url[0].path;
        if (this.menuHeaderId === 'pro_canary') {
          if (this.session.isAdmin() && this.route.snapshot.params.user) {
            this.user = this.route.snapshot.params.user;
          }
          this.setProRoutes();
        }
      }
    });

    // Get the title, description and whether it's a menu
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.setSecondaryPane();
      });

    this.setProRoutes();
    this.setSecondaryPane();
    this.loadSettings();
  }

  /**
   * Adds released notification menu items
   * @returns { void }
   */

  setProRoutes() {
    const proMainMenuItem = this.mainMenus[0].items.find(
      (item) => item.label === $localize`:@@SETTINGS__PRO__LABEL:Pro`
    );

    proMainMenuItem.id = `pro_canary/${this.user}`;

    // const proPreviewMenuItem = this.secondaryMenus.pro_canary
    //   .find((item) => item.header.id === 'pro-subscription')
    //   .items.find((item) => item.id === 'view-pro-channel');

    // proPreviewMenuItem.route = `/pro/${this.user}`;
  }

  async loadSettings(): Promise<void> {
    // Initialize settings$
    await this.settingsService.loadSettings(
      this.session.getLoggedInUser().guid
    );

    // Initialize proSettings$
    if (this.session.isAdmin()) {
      await this.proService.get(this.user);
    } else {
      await this.proService.get();
    }

    this.init = true;
  }

  setSecondaryPane(): void {
    this.secondaryPaneIsMenu = false;
    this.singleLevelMenuId = null;

    let snapshot = this.route.snapshot;

    if (snapshot.data['singleLevelMenuId']) {
      // It's a component that doens't have a secondary menu
      this.singleLevelMenuId = snapshot.data['singleLevelMenuId'];
    } else if (snapshot.firstChild && snapshot.firstChild.data['title']) {
      // It's a component nested in a secondary menu
      snapshot = snapshot.firstChild;

      if ('standardHeader' in snapshot.data) {
        this.standardHeader = snapshot.data['standardHeader'];
      } else {
        this.standardHeader = true;
      }
    } else if (snapshot.data['isMenu']) {
      // It's a secondary menu
      this.secondaryPaneIsMenu = snapshot.data['isMenu'];
    }

    this.routeData = snapshot.data;
  }

  /**
   * Subscribe to output events from components
   * activated from within the router outlet
   */
  onActivate(elementRef): void {
    if (elementRef.formSubmitted) {
      elementRef.formSubmitted.subscribe(($event) => {
        if ($event.formSubmitted) {
          this.toasterService.success('Changes saved');
        } else {
          this.toasterService.error($event.error || 'Save error');
        }
      });
    }
  }

  mainMenuItemSelected(): void {
    this.onMainNav = false;
  }

  // Clicking the back button on a secondary menu
  // brings you back to the top level menu
  secondaryMenuClickedBack(): void {
    this.onMainNav = true;
    this.router.navigate(['/settings']);
  }

  // Clicking the back button on a form brings you back
  // to the relevant secondary menu
  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route.firstChild });
  }

  shouldShowUpgradesMenu(): boolean {
    return (this.isNotPlusUser() || this.isNotProUser()) && !this.isTenant;
  }

  isNotProUser(): boolean {
    return !this.session.getLoggedInUser().pro && !this.isTenant;
  }

  isNotPlusUser(): boolean {
    return !this.session.getLoggedInUser().plus && !this.isTenant;
  }

  isPlusUser(): boolean {
    return this.session.getLoggedInUser().plus && !this.isTenant;
  }

  isProUser(): boolean {
    return this.session.getLoggedInUser().pro && !this.isTenant;
  }

  isNotTenantSite(): boolean {
    return !this.isTenant;
  }

  /**
   * Whether the user can access RSS Sync settings.
   * @returns { boolean } - whether the user can access RSS Sync settings.
   */
  private hasRssSyncPermission(): boolean {
    return this.permissionsService.has(PermissionsEnum.CanUseRssSync);
  }

  /**
   * Whether the user should be shown the content migration header.
   * @returns { boolean } - true if the user should be shown the content migration header.
   */
  private shouldShowContentMigrationHeader(): boolean {
    return this.hasRssSyncPermission() || this.isNotTenantSite();
  }

  get isTenant(): boolean {
    return this.IsTenantService.is();
  }
}
