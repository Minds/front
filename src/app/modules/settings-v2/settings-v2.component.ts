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
        label: 'Settings',
        id: 'settings',
      },
      items: [
        { label: 'Account', id: 'account' },
        { label: 'Pro', id: 'pro_canary' }, // :user param added later
        { label: 'Security', id: 'security' },
        { label: 'Billing', id: 'billing' },
        { label: 'Other', id: 'other' },
      ],
    },
  ];
  secondaryMenus = {
    account: [
      {
        header: {
          label: 'General Account Settings',
          id: 'account',
        },
        items: [
          { label: 'Display Name', id: 'display-name' },
          { label: 'Email Address', id: 'email-address' },
          { label: 'Display Language', id: 'display-language' },
          { label: 'Password', id: 'password' },
          { label: 'NSFW Content', id: 'nsfw-content' },
          { label: 'Share Buttons', id: 'share-buttons' },
          { label: 'Autoplay Videos', id: 'autoplay-videos' },
        ],
      },
      {
        header: {
          label: 'Notifications',
          id: 'notifications',
        },
        items: [
          { label: 'Email', id: 'email-notifications' },
          { label: 'Popovers', id: 'toaster-notifications' },
        ],
      },
      {
        header: {
          label: 'Account Upgrade',
          id: 'account-upgrade',
        },
        shouldShow: this.shouldShowUpgradesMenu.bind(this),
        items: [
          {
            label: 'Upgrade to Pro',
            id: 'upgrade-to-pro',
            route: '/pro',
            shouldShow: this.shouldShowProMenuItem.bind(this),
          },
          {
            label: 'Upgrade to Plus',
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
          label: 'Security',
          id: 'security',
        },
        items: [
          { label: 'Two-factor Authentication', id: 'two-factor' },
          { label: 'Sessions', id: 'sessions' },
        ],
      },
    ],
    billing: [
      {
        header: {
          label: 'Billing',
          id: 'billing',
        },
        items: [
          { label: 'Payment Methods', id: 'payment-methods' },
          { label: 'Recurring Payments', id: 'recurring-payments' },
        ],
      },
    ],

    pro_canary: [
      {
        header: {
          label: 'Pro Settings',
          id: 'pro_canary',
        },
        items: [
          { label: 'General', id: 'general' },
          { label: 'Theme', id: 'theme' },
          { label: 'Assets', id: 'assets' },
          { label: 'Hashtags', id: 'hashtags' },
          { label: 'Footer', id: 'footer' },
          { label: 'Domain', id: 'domain' },
          { label: 'Payouts', id: 'payouts' },
        ],
      },
      {
        header: {
          label: 'Pro Subscription Management',
          id: 'pro-subscription',
        },
        items: [
          { label: 'Cancel Pro Subscription', id: 'cancel' },
          {
            label: 'View Pro Channel',
            id: 'view-pro-channel',
            route: '',
          },
        ],
      },
    ],
    other: [
      {
        header: {
          label: 'Content Admin',
          id: 'content-admin',
        },
        items: [
          { label: 'Reported Content', id: 'reported-content' },
          { label: 'Blocked Channels', id: 'blocked-channels' },
        ],
      },
      {
        header: {
          label: 'Paid Content',
          id: 'paid-content',
        },
        items: [
          { label: 'Subscription Tier Management', id: 'subscription-tiers' },
          { label: 'Paywall Preview', id: 'paywall-preview' },
        ],
      },
      {
        header: {
          label: 'Deactivate and Delete Account',
          id: 'deactivate-account',
        },
        items: [
          { label: 'Deactivate Account', id: 'deactivate-account' },
          { label: 'Delete Account', id: 'delete-account' },
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
    protected formToastService: FormToastService,
    public featuresService: FeaturesService
  ) {
    this.newNavigation = this.featuresService.has('navigation');
    this.hasYoutubeFeature = this.featuresService.has('yt-importer');
  }

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }
    this.user = this.session.getLoggedInUser().username;

    if (this.route.snapshot.url.length === 0) {
      this.router.navigateByUrl('/settings/canary/account?ref=main', {
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

    // Conditionally show feature flagged items
    if (this.hasYoutubeFeature) {
      const youtubeMenuItem = {
        header: {
          label: 'Content Migration',
          id: 'content-migration',
        },
        items: [{ label: 'Youtube', id: 'youtube-migration' }],
      };
      this.secondaryMenus.other.splice(2, 0, youtubeMenuItem);
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

    this.setProRoutes();
    this.setSecondaryPane();
    this.loadSettings();
  }

  setProRoutes() {
    const proMainMenuItem = this.mainMenus[0].items.find(
      item => item.label === 'Pro'
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
          this.formToastService.success('Changes saved');
        } else {
          this.formToastService.error($event.error || 'Save error');
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
    this.router.navigate(['/settings/canary']);
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
