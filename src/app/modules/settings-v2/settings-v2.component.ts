import { Component, OnInit } from '@angular/core';
import { NestedMenu } from '../../common/layout/nested-menu/nested-menu.component';
import { Session } from '../../services/session';
import { Router } from '@angular/router';

@Component({
  selector: 'm-settingsV2',
  templateUrl: './settings-v2.component.html',
})
export class SettingsV2Component implements OnInit {
  mainMenus: NestedMenu[];
  subMenus = {
    account: [
      {
        header: {
          label: 'Account',
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
    // billing: [
    //   {
    //     header: {
    //       label: 'Billing',
    //       id: 'billing',
    //     },
    //     items: [
    //       { label: 'Payment Methods', id: 'payment-methods' },
    //       { label: 'Recurring Payments', id: 'recurring-payments' },
    //     ],
    //   },
    // ],
    // pro: [
    //   {
    //     header: {
    //       label: 'Pro',
    //       id: 'pro',
    //     },
    //     items: [
    //       { label: 'General', id: 'general' },
    //       { label: 'Theme', id: 'theme' },
    //     ],
    //   },
    // ],
    // other: [
    //   {
    //     header: {
    //       label: 'Content Admin',
    //       id: 'contentAdmin',
    //     },
    //     items: [
    //       { label: 'Reported Content', id: 'reported-content' },
    //       { label: 'Blocked Channels', id: 'blocked-channels' },
    //     ],
    //   },
    //   {
    //     header: {
    //       label: 'Paid Content',
    //       id: 'paidContent',
    //     },
    //     items: [
    //       { label: 'Subscription Tier Management', id: 'subscriptionTiers' },
    //       { label: 'Post Preview', id: 'post-preview' },
    //     ],
    //   },
    //   {
    //     header: {
    //       label: 'Deactivate and Delete Account',
    //       id: 'deactivateAccount',
    //     },
    //     items: [
    //       { label: 'Deactivate Account', id: 'deactivateAccount' },
    //       { label: 'Delete Account', id: 'delete-account' },
    //     ],
    //   },
    // ],
  };

  constructor(public router: Router, protected session: Session) {}

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      return this.router.navigate(['/login']);
    }
    // const menuHeader = '@' + this.session.getLoggedInUser().name;

    this.mainMenus = [
      {
        header: {
          label: 'Settings',
          id: 'settings',
        },
        items: [
          { label: 'Account', id: 'account' },
          { label: 'Security', id: 'security' },
          // { label: 'Billing', id: 'billing' },
          // { label: 'Other', id: 'other' },
        ],
      },
    ];

    if (this.session.getLoggedInUser().pro) {
      this.mainMenus[0].items.splice(1, 0, { label: 'Pro', id: 'pro' });
    }
  }
}
