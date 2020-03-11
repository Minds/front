import { Component, OnInit } from '@angular/core';
import { NestedMenu } from '../../common/layout/nested-menu/nested-menu.component';
import { Session } from '../../services/session';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'm-settingsV2',
  templateUrl: './settings-v2.component.html',
})
export class SettingsV2Component implements OnInit {
  init: boolean = false;
  secondaryPanelIsMenu: boolean = false;
  showMainMenuOnMobile: boolean = false;
  menuHeaderId: string = 'account';
  routeData: any;

  mainMenus: NestedMenu[] = [
    {
      header: {
        label: 'Settings',
        id: 'settings',
      },
      items: [
        { label: 'Account', id: 'account' },
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
        ],
      },
      {
        header: {
          label: 'Account Upgrade',
          id: 'account-upgrade',
        },
        items: [
          { label: 'Upgrade to Pro', id: 'upgrade-to-pro' },
          { label: 'Upgrade to Plus', id: 'upgrade-to-plus' },
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
    pro: [
      {
        header: {
          label: 'Pro',
          id: 'pro',
        },
        items: [
          { label: 'General', id: 'general' },
          { label: 'Theme', id: 'theme' },
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
    protected session: Session
  ) {}

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      return this.router.navigate(['/login']);
    }

    if (this.session.getLoggedInUser().pro) {
      this.mainMenus[0].items.splice(1, 0, { label: 'Pro', id: 'pro' });
    }

    this.route.url.subscribe(url => {
      this.menuHeaderId = url[0].path;
      console.log('path', url[0]);
    });

    // Get the title, description and whether it's a menu
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.setupSecondaryPanel();
      });

    this.setupSecondaryPanel();
  }

  setupSecondaryPanel(): void {
    // const route
    console.log('SETUP!!', this.route.snapshot);

    this.secondaryPanelIsMenu = false;
    let snapshot = this.route.snapshot;
    if (snapshot.firstChild && snapshot.firstChild.data['title']) {
      snapshot = snapshot.firstChild;
    } else {
      if (snapshot.data['isMenu']) {
        this.secondaryPanelIsMenu = snapshot.data['isMenu'];
      }
    }
    this.routeData = snapshot.data;
    this.init = true;
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route.firstChild });
  }
}
