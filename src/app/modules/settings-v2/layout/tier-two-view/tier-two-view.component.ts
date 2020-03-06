import { Component, OnInit, Input } from '@angular/core';
import { NestedMenu } from '../../../../common/layout/nested-menu/nested-menu.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';

/**
 * Handles the right side of the settings component,
 * which will be either a menu (if no form is selected) or a form
 */
@Component({
  selector: 'm-settingsV2__tierTwoView',
  templateUrl: './tier-two-view.component.html',
})
export class SettingsV2TierTwoViewComponent implements OnInit {
  init: boolean = false;
  isMenu: boolean = false;
  path: string = '';
  menuHeaderId: string = 'account';
  routeData: any;

  tierTwoMenus = {
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
          id: 'contentAdmin',
        },
        items: [
          { label: 'Reported Content', id: 'reported-content' },
          { label: 'Blocked Channels', id: 'blocked-channels' },
        ],
      },
      {
        header: {
          label: 'Paid Content',
          id: 'paidContent',
        },
        items: [
          { label: 'Subscription Tier Management', id: 'subscriptionTiers' },
          { label: 'Post Preview', id: 'post-preview' },
        ],
      },
      {
        header: {
          label: 'Deactivate and Delete Account',
          id: 'deactivateAccount',
        },
        items: [
          { label: 'Deactivate Account', id: 'deactivateAccount' },
          { label: 'Delete Account', id: 'delete-account' },
        ],
      },
    ],
  };
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.url.subscribe(url => {
      this.path = url[0].path;
      console.log('path', this.path);
    });

    // Get the title, description and whether it's a menu
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.setup();
      });

    this.setup();
  }

  setup(): void {
    this.isMenu = false;
    let snapshot = this.route.snapshot;
    if (snapshot.firstChild && snapshot.firstChild.data['title']) {
      snapshot = snapshot.firstChild;
    } else {
      if (snapshot.data['isMenu']) {
        this.isMenu = snapshot.data['isMenu'];
      }
      if (this.isMenu) {
        this.menuHeaderId = this.path;
      }
    }
    this.routeData = snapshot.data;
    this.init = true;
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
