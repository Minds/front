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
  subMenus;
  constructor(public router: Router, protected session: Session) {}

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      return this.router.navigate(['/login']);
    }
    const menuHeader = '@' + this.session.getLoggedInUser().name;

    this.mainMenus = [
      {
        header: {
          label: menuHeader,
          id: 'settings',
        },
        items: [
          { label: 'Account', id: 'account' },
          { label: 'Security', id: 'security' },
          { label: 'Billing', id: 'billing' },
          { label: 'Pro', id: 'pro' },
          { label: 'Other', id: 'other' },
        ],
      },
    ];

    this.subMenus = {
      account: [
        {
          header: {
            label: 'Account',
            id: 'account',
          },
          items: [
            { label: 'Display Name', id: 'displayName' },
            { label: 'Email Address', id: 'emailAddress' },
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
            { label: 'Two-factor Authentication', id: 'twoFactor' },
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
            { label: 'Payment Methods', id: 'paymentMethods' },
            { label: 'Recurring Payments', id: 'recurringPayments' },
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
            { label: 'Reported Content', id: 'reportedContent' },
            { label: 'Blocked Channels', id: 'blockedChannels' },
          ],
        },
        {
          header: {
            label: 'Paid Content',
            id: 'paidContent',
          },
          items: [
            { label: 'Subscription Tier Management', id: 'subscriptionTiers' },
            { label: 'Post Preview', id: 'postPreview' },
          ],
        },
        {
          header: {
            label: 'Deactivate and Delete Account',
            id: 'deactivateAccount',
          },
          items: [
            { label: 'Deactivate Account', id: 'deactivateAccount' },
            { label: 'Delete Account', id: 'deleteAccount' },
          ],
        },
      ],
    };
  }

  mainMenuItemSelected($event) {
    console.log('settingsv2 - a MAIN menu item was selected', $event.item);
    // todoojm do something here
  }

  subMenuItemSelected($event) {
    console.log('settingsv2 - a SUBMENU item was selected', $event.item);
    // todoojm do something here
  }
}
