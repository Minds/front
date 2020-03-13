import { Component, OnInit } from '@angular/core';
import { NestedMenu } from '../../common/layout/nested-menu/nested-menu.component';
import { Session } from '../../services/session';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SettingsV2Service } from './settings-v2.service';
import { FormToastService } from '../../common/services/form-toast.service';
import { ProService } from '../pro/pro.service';
import { FeaturesService } from '../../services/features.service';

/**
 * Main component that determines what form/menu(s)
 * should be displayed in the settings-v2 module
 */
@Component({
  selector: 'm-settingsV2',
  templateUrl: './settings-v2.component.html',
})
export class SettingsV2Component implements OnInit {
  init: boolean = false;
  secondaryPaneIsMenu: boolean = false;
  showMainMenuOnMobile: boolean = false;
  menuHeaderId: string = 'account';
  routeData: any;
  newNavigation: boolean = false;

  mainMenus: NestedMenu[] = [
    {
      header: {
        label: 'Settings',
        id: 'settings',
      },
      items: [
        { label: 'Account', id: 'account' },
        { label: 'Pro', id: 'pro_canary' },
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
        ],
      },
      {
        header: {
          label: 'Notifications',
          id: 'notifications',
        },
        items: [
          { label: 'Email', id: 'email-notifications' },
          { label: 'Toaster', id: 'toaster-notifications' },
        ],
      },
      {
        header: {
          label: 'Account Upgrade',
          id: 'account-upgrade',
        },
        items: [
          { label: 'Upgrade to Pro', id: 'upgrade-to-pro', route: '/pro' },
          { label: 'Upgrade to Plus', id: 'upgrade-to-plus', route: '/plus' },
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
          label: 'General Pro Settings',
          id: 'pro',
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
          { label: 'Cancel Pro Subscription', id: 'cancel-pro-subscription' },
          {
            label: 'View Pro Channel',
            id: 'view-pro-channel',
            route: '/TODOOJM',
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
          { label: 'Post Preview', id: 'post-preview' },
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
  }

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }

    // if (this.session.getLoggedInUser().pro) {
    //   this.mainMenus[0].items.splice(1, 0, { label: 'Pro', id: 'pro' });
    // }

    this.route.url.subscribe(url => {
      this.menuHeaderId = url[0].path;
    });

    // Get the title, description and whether it's a menu
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.setsecondaryPane();
      });

    this.setsecondaryPane();
    this.loadSettings();
  }

  async loadSettings(): Promise<void> {
    // Initialize settings$
    await this.settingsService.loadSettings(
      this.session.getLoggedInUser().guid
    );

    // Initialize proSettings$
    // TODOOJM handle admins
    // if(this.session.isAdmin()){}
    const remoteUser: string | null = null;
    await this.proService.get(remoteUser);

    this.init = true;
  }

  setsecondaryPane(): void {
    this.secondaryPaneIsMenu = false;
    let snapshot = this.route.snapshot;
    if (snapshot.firstChild && snapshot.firstChild.data['title']) {
      snapshot = snapshot.firstChild;
    } else {
      if (snapshot.data['isMenu']) {
        this.secondaryPaneIsMenu = snapshot.data['isMenu'];
      }
    }
    this.routeData = snapshot.data;
  }

  /** Subscribe to output events from components
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

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route.firstChild });
  }
}
