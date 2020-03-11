import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CheckoutModule } from '../checkout/checkout.module';
import { ModalsModule } from '../modals/modals.module';
import { CommonModule } from '../../common/common.module';
import { LegacyModule } from '../legacy/legacy.module';
import { ReportModule } from '../report/report.module';
import { PaymentsModule } from '../payments/payments.module';
import { WireModule } from '../wire/wire.module';

import { CanDeactivateGuardService } from '../../services/can-deactivate-guard';

import { SettingsV2Component } from './settings-v2.component';
import { SettingsV2DisplayNameComponent } from './account/display-name/display-name.component';
import { SettingsV2SessionsComponent } from './security/sessions/sessions.component';
import { SettingsV2TwoFactorComponent } from './security/two-factor/two-factor.component';
import { SettingsV2EmailAddressComponent } from './account/email-address/email-address.component';
import { SettingsV2DisplayLanguageComponent } from './account/display-language/display-language.component';
import { SettingsV2PasswordComponent } from './account/password/password.component';
import { SettingsV2EmailNotificationsComponent } from './account/email-notifications/email-notifications.component';
import { SettingsV2NsfwContentComponent } from './account/nsfw-content/nsfw-content.component';
import { SettingsV2ShareButtonsComponent } from './account/share-buttons/share-buttons.component';
import { MindsFormsModule } from '../forms/forms.module';
import { SettingsV2Service } from './settings-v2.service';
import { SettingsModule } from '../settings/settings.module';
import { SettingsV2PaymentMethodsComponent } from './billing/payment-methods/payment-methods.component';
import { SettingsV2RecurringPaymentsComponent } from './billing/recurring-payments/recurring-payments.component';
import { SettingsV2ReportedContentComponent } from './other/reported-content/reported-content.component';
import { SettingsV2BlockedChannelsComponent } from './other/blocked-channels/blocked-channels.component';
import { SettingsV2SubscriptionTiersComponent } from './other/subscription-tiers/subscription-tiers.component';
import { SettingsV2PostPreviewComponent } from './other/post-preview/post-preview.component';
import { SettingsV2DeactivateAccountComponent } from './other/deactivate-account/deactivate-account.component';
import { SettingsV2DeleteAccountComponent } from './other/delete-account/delete-account.component';
import { SettingsV2ToasterNotificationsComponent } from './account/toaster-notifications/toaster-notifications.component';

const SETTINGS_V2_ROUTES: Routes = [
  {
    path: 'settings/canary',
    // component: SettingsV2Component,
    data: {
      title: 'Settings',
      description: 'Configure your Minds settings',
      ogImage: '/assets/photos/network.jpg',
    },
    children: [
      { path: '', redirectTo: 'account', pathMatch: 'full' },
      {
        path: 'account',
        component: SettingsV2Component,
        data: {
          isMenu: true,
          title: 'Account',
          description: 'Configure your general account settings.',
        },
        children: [
          {
            path: 'display-name',
            component: SettingsV2DisplayNameComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Display Name',
              description: 'Customize your display name.',
            },
          },
          {
            path: 'email-address',
            component: SettingsV2EmailAddressComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Email Address',
              description:
                'Change the email address where notifications are sent.',
            },
          },
          {
            path: 'display-language',
            component: SettingsV2DisplayLanguageComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Display Language',
              description: 'Change the web interface language.',
            },
          },
          {
            path: 'password',
            component: SettingsV2PasswordComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Password',
              description: 'Change account password.',
            },
          },
          {
            path: 'email-notifications',
            component: SettingsV2EmailNotificationsComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Email Notifications',
              description:
                'Control what email notifications you receive, and when.',
            },
          },
          {
            path: 'nsfw-content',
            component: SettingsV2NsfwContentComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'NSFW Content',
              description:
                'Control how NSFW content is displayed in your newsfeed.',
            },
          },
          {
            path: 'share-buttons',
            component: SettingsV2ShareButtonsComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Share Buttons',
              description: 'Control whether you see the share button overlay.',
            },
          },
          // { path: '**', redirectTo: 'account' },
        ],
      },
      {
        path: 'security',
        component: SettingsV2Component,
        data: {
          isMenu: true,
          title: 'Security',
          description: 'Configure your account security settings.',
        },
        children: [
          {
            path: 'two-factor',
            component: SettingsV2TwoFactorComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Two-factor Authentication',
              description:
                'Add an extra layer of security to your account by enabling 2FA.',
            },
          },
          {
            path: 'sessions',
            component: SettingsV2SessionsComponent,
            data: {
              title: 'Sessions',
              description: 'Close all sessions with a single click.',
            },
          },
        ],
      },
      {
        path: 'billing',
        component: SettingsV2Component,
        data: {
          isMenu: true,
          title: 'Billing',
          description: 'Configure your account billing settings.',
        },
        children: [
          {
            path: 'payment-methods',
            component: SettingsV2PaymentMethodsComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Payment Methods',
              description: 'Placeholder',
            },
          },
          {
            path: 'recurring-payments',
            component: SettingsV2RecurringPaymentsComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'RecurringPayments',
              description: 'Placeholder',
            },
          },
        ],
      },
      {
        path: 'other',
        component: SettingsV2Component,
        data: {
          isMenu: true,
          title: 'Other',
          description: 'Additional settings.',
        },
        children: [
          {
            path: 'reported-content',
            component: SettingsV2ReportedContentComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Reported Content',
              description: 'Placeholder',
            },
          },
          {
            path: 'blocked-channels',
            component: SettingsV2BlockedChannelsComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Blocked Channels',
              description: 'Placeholder',
            },
          },
          {
            path: 'subscription-tiers',
            component: SettingsV2SubscriptionTiersComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Subscription Tiers',
              description: 'Placeholder',
            },
          },
          {
            path: 'post-preview',
            component: SettingsV2PostPreviewComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Post Preview',
              description: 'Placeholder',
            },
          },
          {
            path: 'deactivate-account',
            component: SettingsV2DeactivateAccountComponent,
            data: {
              title: 'Deactivate Account',
              description: 'Placeholder',
            },
          },
          {
            path: 'delete-account',
            component: SettingsV2DeleteAccountComponent,
            data: {
              title: 'Delete Account',
              description: 'Placeholder',
            },
          },
        ],
      },
      // {
      //   path: '**',
      //   redirectTo: '',
      // },
    ],
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CheckoutModule,
    ModalsModule,
    LegacyModule,
    RouterModule.forChild(SETTINGS_V2_ROUTES),
    ReportModule,
    PaymentsModule,
    WireModule,
    MindsFormsModule,
    SettingsModule,
  ],
  declarations: [
    SettingsV2Component,
    SettingsV2DisplayNameComponent,
    SettingsV2SessionsComponent,
    SettingsV2TwoFactorComponent,
    SettingsV2EmailAddressComponent,
    SettingsV2DisplayLanguageComponent,
    SettingsV2PasswordComponent,
    SettingsV2EmailNotificationsComponent,
    SettingsV2NsfwContentComponent,
    SettingsV2ShareButtonsComponent,
    SettingsV2PaymentMethodsComponent,
    SettingsV2RecurringPaymentsComponent,
    SettingsV2ReportedContentComponent,
    SettingsV2BlockedChannelsComponent,
    SettingsV2SubscriptionTiersComponent,
    SettingsV2PostPreviewComponent,
    SettingsV2DeactivateAccountComponent,
    SettingsV2DeleteAccountComponent,
    SettingsV2ToasterNotificationsComponent,
  ],
  providers: [SettingsV2Service],
  exports: [SettingsV2Component],
})
export class SettingsV2Module {}
