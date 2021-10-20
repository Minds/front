import { Component, OnInit } from '@angular/core';
import { NestedMenu } from '../../common/layout/nested-menu/nested-menu.component';
import { Session } from '../../services/session';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  ParamMap,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { SettingsV2Service } from './settings-v2.service';
import { FormToastService } from '../../common/services/form-toast.service';
import { ProService } from '../pro/pro.service';
import { FeaturesService } from '../../services/features.service';
import { Subscription } from 'rxjs';

/**
 * Determines what form/menu(s)
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
  newNavigation: boolean = false;
  user: string | null = null;
  onMainNav: boolean = false;
  hasYoutubeFeature: boolean = false;

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
        { label: $localize`:@@SETTINGS__PRO__LABEL:Pro`, id: 'pro_canary' }, // :user param added later
        {
          label: $localize`:@@SETTINGS__SECURITY__LABEL:Security`,
          id: 'security',
        },
        {
          label: $localize`:@@SETTINGS__BILLING__LABEL:Billing`,
          id: 'billing',
        },
        { label: $localize`:@@SETTINGS__OTHER__LABEL:Other`, id: 'other' },
      ],
    },
  ];
  secondaryMenus = {
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
          },
          {
            label: $localize`:@@SETTINGS__ACCOUNT__PASSWORD__LABEL:Password`,
            id: 'password',
          },
          {
            label: $localize`:@@SETTINGS__ACCOUNT__BOOST__LABEL:Boosted Content`,
            id: 'boosted-content',
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
          },
        ],
      },
      {
        header: {
          label: $localize`:@@SETTINGS__NOTIFICATIONS__HEADER__LABEL:Notifications`,
          id: 'notifications',
        },
        items: [],
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
            shouldShow: this.shouldShowProMenuItem.bind(this),
          },
          {
            label: $localize`:@@SETTINGS__ACCOUNTUPGRADE__PLUS__LABEL:Upgrade to Plus`,
            id: 'upgrade-to-plus',
            route: '/plus',
            shouldShow: this.shouldShowPlusMenuItem.bind(this),
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
        ],
      },
    ],
    billing: [
      {
        header: {
          label: $localize`:@@SETTINGS__BILLING__HEADER__LABEL:Billing`,
          id: 'billing',
        },
        items: [
          {
            label: $localize`:@@SETTINGS__BILLING__METHOD__LABEL:Payment Methods`,
            id: 'payment-methods',
          },
          {
            label: $localize`:@@SETTINGS__BILLING__RECURRING__LABEL:Recurring Payments`,
            id: 'recurring-payments',
          },
        ],
      },
    ],

    pro_canary: [
      {
        header: {
          label: $localize`:@@SETTINGS__PRO__HEADER__LABEL:Pro Settings`,
          id: 'pro_canary',
        },
        items: [
          {
            label: $localize`:@@SETTINGS__PRO__GENERAL__LABEL:General`,
            id: 'general',
          },
          {
            label: $localize`:@@SETTINGS__PRO__THEME__LABEL:Theme`,
            id: 'theme',
          },
          {
            label: $localize`:@@SETTINGS__PRO__ASSETS__LABEL:Assets`,
            id: 'assets',
          },
          {
            label: $localize`:@@SETTINGS__PRO__HASHTAGS__LABEL:Hashtags`,
            id: 'hashtags',
          },
          {
            label: $localize`:@@SETTINGS__PRO__FOOTER__LABEL:Footer`,
            id: 'footer',
          },
          {
            label: $localize`:@@SETTINGS__PRO__DOMAIN__LABEL:Domain`,
            id: 'domain',
          },
          {
            label: $localize`:@@SETTINGS__PRO__PAYOUTS__LABEL:Payouts`,
            id: 'payouts',
          },
        ],
      },
      {
        header: {
          label: $localize`:@@SETTINGS__PRO__SUBSCRIPTION__HEADER__LABEL:Pro Subscription Management`,
          id: 'pro-subscription',
        },
        items: [
          {
            label: $localize`:@@SETTINGS__PRO__SUBSCRIPTION__CANCEL__LABEL:Cancel Pro Subscription`,
            id: 'cancel',
          },
          {
            label: $localize`:@@SETTINGS__PRO__VIEW__CHANNEL__LABEL:View Pro Channel`,
            id: 'view-pro-channel',
            route: '',
          },
        ],
      },
    ],
    other: [
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
          label: 'Content Migration',
          id: 'content-migration',
        },
        items: [],
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
    protected toasterService: FormToastService,
    public featuresService: FeaturesService
  ) {
    this.newNavigation = true;
    this.hasYoutubeFeature = this.featuresService.has('yt-importer');
  }

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }
    this.user = this.session.getLoggedInUser().username;

    if (this.route.snapshot.url.length === 0) {
      this.router.navigateByUrl('/settings/account?ref=main', {
        skipLocationChange: true,
      });
    }

    this.route.queryParamMap.subscribe(params => {
      this.onMainNav = params.get('ref') === 'main' ? true : false;
    });

    this.route.url.subscribe(url => {
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
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.setSecondaryPane();
      });

    const contentMigrationMenu = this.secondaryMenus.other[2];

    // Conditionally show feature flagged items
    if (this.hasYoutubeFeature) {
      contentMigrationMenu.items.push({
        label: 'Youtube',
        id: 'youtube-migration',
      });
    }

    if (this.featuresService.has('twitter-sync')) {
      contentMigrationMenu.items.push({ label: 'Twitter', id: 'twitter-sync' });
    }

    if (this.featuresService.has('settings-referrals')) {
      const referralsMenuItem = {
        header: {
          label: 'Referrals',
          id: 'referrals',
        },
        items: [{ label: 'Referrals', id: 'referrals' }],
      };
      this.secondaryMenus.other.splice(0, 0, referralsMenuItem);
    }

    this.addNotificationsMenuItems();

    this.setProRoutes();
    this.setSecondaryPane();
    this.loadSettings();
  }

  /**
   * Adds released notification menu items depending
   * on notifications-v3 feat flag.
   * @returns { void }
   */
  private addNotificationsMenuItems(): void {
    let menuItems = [];
    if (this.featuresService.has('notifications-v3')) {
      menuItems = [
        {
          label: 'Push Notifications',
          id: 'push-notifications',
          route: null,
          shouldShow: null,
        },
        {
          label: 'Email Notifications',
          id: 'email-notifications-v2',
          route: null,
          shouldShow: null,
        },
      ];
    } else {
      menuItems = [
        {
          label: 'Email Notifications',
          id: 'email-notifications',
        },
        {
          label: 'Popovers',
          id: 'toaster-notifications',
        },
      ];
    }

    this.secondaryMenus.account
      .filter(item => {
        return item.header.id === 'notifications';
      })[0]
      .items.push(...menuItems);
  }

  setProRoutes() {
    const proMainMenuItem = this.mainMenus[0].items.find(
      item => item.label === $localize`:@@SETTINGS__PRO__LABEL:Pro`
    );

    proMainMenuItem.id = `pro_canary/${this.user}`;

    const proPreviewMenuItem = this.secondaryMenus.pro_canary
      .find(item => item.header.id === 'pro-subscription')
      .items.find(item => item.id === 'view-pro-channel');

    proPreviewMenuItem.route = `/pro/${this.user}`;
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
    let snapshot = this.route.snapshot;
    if (snapshot.firstChild && snapshot.firstChild.data['title']) {
      // Is not a menu
      snapshot = snapshot.firstChild;

      if ('standardHeader' in snapshot.data) {
        this.standardHeader = snapshot.data['standardHeader'];
      } else {
        this.standardHeader = true;
      }
    } else {
      // Is a menu
      if (snapshot.data['isMenu']) {
        this.secondaryPaneIsMenu = snapshot.data['isMenu'];
      }
    }
    this.routeData = snapshot.data;
  }

  /**
   * Subscribe to output events from components
   * activated from within the router outlet
   */
  onActivate(elementRef): void {
    if (elementRef.formSubmitted) {
      elementRef.formSubmitted.subscribe($event => {
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
    return this.shouldShowPlusMenuItem() || this.shouldShowProMenuItem();
  }

  shouldShowProMenuItem(): boolean {
    return !this.session.getLoggedInUser().pro;
  }

  shouldShowPlusMenuItem(): boolean {
    return !this.session.getLoggedInUser().plus;
  }
}
