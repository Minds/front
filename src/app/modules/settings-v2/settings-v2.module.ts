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
import { SettingsV2PaywallPreviewComponent } from './other/paywall-preview/paywall-preview.component';
import { SettingsV2DeactivateAccountComponent } from './other/deactivate-account/deactivate-account.component';
import { SettingsV2DeleteAccountComponent } from './other/delete-account/delete-account.component';
import { SettingsV2ToasterNotificationsComponent } from './account/toaster-notifications/toaster-notifications.component';
import { WalletV2Module } from '../wallet/v2/wallet-v2.module';
import { ProModule } from '../pro/pro.module';
import { SettingsV2ProGeneralComponent } from './pro/general/general.component';
import { SettingsV2ProThemeComponent } from './pro/theme/theme.component';
import { SettingsV2ProAssetsComponent } from './pro/assets/assets.component';
import { SettingsV2ProHashtagsComponent } from './pro/hashtags/hashtags.component';
import { SettingsV2ProFooterComponent } from './pro/footer/footer.component';
import { SettingsV2ProDomainComponent } from './pro/domain/domain.component';
import { SettingsV2ProPayoutsComponent } from './pro/payouts/payouts.component';
import { SettingsV2ProCancelComponent } from './pro/cancel/cancel.component';
import { StrikesComponent } from '../report/strikes/strikes.component';
import { SettingsV2AutoplayVideosComponent } from './account/autoplay-videos/autoplay-videos.component';

const SETTINGS_V2_ROUTES: Routes = [
  {
    path: '',
    data: {
      title: 'Settings',
      description: 'Configure your Minds settings',
      ogImage: '/assets/photos/network.jpg',
    },
    children: [
      {
        path: 'account',
        component: SettingsV2Component,
        data: {
          isMenu: true,
          title: 'Account Settings',
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
            data: {
              title: 'Display Language Settings',
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
            path: 'nsfw-content',
            component: SettingsV2NsfwContentComponent,
            data: {
              title: 'NSFW Content',
              description:
                'Control how NSFW content is displayed in your newsfeed.',
            },
          },
          {
            path: 'share-buttons',
            component: SettingsV2ShareButtonsComponent,
            data: {
              title: 'Share Buttons',
              description: 'Control whether you see the share button overlay.',
            },
          },
          {
            path: 'autoplay-videos',
            component: SettingsV2AutoplayVideosComponent,
            data: {
              title: 'Autoplay Videos',
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
            path: 'toaster-notifications',
            component: SettingsV2ToasterNotificationsComponent,
            data: {
              title: 'Notification Popovers',
              description: 'Control whether you receive notification popovers.',
            },
          },
          { path: '**', redirectTo: 'account' },
        ],
      },
      {
        path: 'pro_canary/:user',
        component: SettingsV2Component,
        data: {
          isMenu: true,
          title: 'Pro Settings',
          description: 'Customize your Pro channel.',
        },
        children: [
          // CAUTION: adding a description to the data in pro settings
          // will also add the description under the page header
          {
            path: 'general',
            component: SettingsV2ProGeneralComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'General Settings',
            },
          },
          {
            path: 'theme',
            component: SettingsV2ProThemeComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Theme',
            },
          },
          {
            path: 'assets',
            component: SettingsV2ProAssetsComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Assets',
            },
          },
          {
            path: 'hashtags',
            component: SettingsV2ProHashtagsComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Hashtags',
            },
          },
          {
            path: 'footer',
            component: SettingsV2ProFooterComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Footer',
            },
          },
          {
            path: 'domain',
            component: SettingsV2ProDomainComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Domain',
            },
          },
          {
            path: 'payouts',
            component: SettingsV2ProPayoutsComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Payouts',
            },
          },
          {
            path: 'cancel',
            component: SettingsV2ProCancelComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Cancel Pro Subscription',
            },
          },
        ],
      },
      {
        path: 'security',
        component: SettingsV2Component,
        data: {
          isMenu: true,
          title: 'Security Settings',
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
          title: 'Billing Settings',
          description: 'Configure your account billing settings.',
        },
        children: [
          {
            path: 'payment-methods',
            component: SettingsV2PaymentMethodsComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Payment Methods',
              description:
                'Manage credit cards associated with your Minds account.',
            },
          },
          {
            path: 'recurring-payments',
            component: SettingsV2RecurringPaymentsComponent,
            data: {
              title: 'Recurring Payments',
              description:
                'Track recurring payments you make to support other channels.',
            },
          },
        ],
      },
      {
        path: 'other',
        component: SettingsV2Component,
        data: {
          isMenu: true,
          title: 'Other Settings',
          description: 'Additional settings.',
        },
        children: [
          {
            path: 'reported-content/strikes',
            component: StrikesComponent,
            data: {
              title: 'Strikes',
              description:
                'Strikes are imposed for violations against the terms of service. Following 3 strikes, channels are banned or marked NSFW',
            },
          },
          {
            path: 'reported-content',
            component: SettingsV2ReportedContentComponent,
            data: {
              title: 'Reported Content',
              description:
                'Oversee disciplinary measures taken on your posts and channel.',
            },
          },
          {
            path: 'blocked-channels',
            component: SettingsV2BlockedChannelsComponent,
            data: {
              title: 'Blocked Channels',
              description: 'Block channels from appearing in your feed.',
            },
          },
          {
            path: 'subscription-tiers',
            component: SettingsV2SubscriptionTiersComponent,
            // canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Subscription Tiers',
              description:
                "Define incentives for users to support your channel. These tiers will be displayed on your channel's sidebar and wire screen.",
            },
          },
          {
            path: 'paywall-preview',
            component: SettingsV2PaywallPreviewComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Paywall Preview',
              description:
                'Customize the appearance of your paywalled posts. The below description and preview image is what your subscribers will see on your exclusive posts until they become a supporter.',
            },
          },
          {
            path: 'deactivate-account',
            component: SettingsV2DeactivateAccountComponent,
            data: {
              title: 'Deactivate Account',
              description:
                'Deactivating your account will make your profile invisible. You will also not receive emails or notifications. Your username will be reserved in case you return to Minds.',
            },
          },
          {
            path: 'delete-account',
            component: SettingsV2DeleteAccountComponent,
            data: {
              title: 'Delete Account',
              description:
                'Warning: This is not reversible and will result in permanent loss of your channel and all of your data. Your channel will not be recoverable. Your username will be released back to the public.',
            },
          },
        ],
      },
      { path: '', component: SettingsV2Component },
      {
        path: '**',
        redirectTo: '',
      },
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
    WalletV2Module,
    ProModule,
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
    SettingsV2PaywallPreviewComponent,
    SettingsV2DeactivateAccountComponent,
    SettingsV2DeleteAccountComponent,
    SettingsV2ToasterNotificationsComponent,
    SettingsV2ProGeneralComponent,
    SettingsV2ProThemeComponent,
    SettingsV2ProAssetsComponent,
    SettingsV2ProHashtagsComponent,
    SettingsV2ProFooterComponent,
    SettingsV2ProDomainComponent,
    SettingsV2ProPayoutsComponent,
    SettingsV2ProCancelComponent,
    SettingsV2AutoplayVideosComponent,
  ],
  providers: [SettingsV2Service],
  exports: [SettingsV2Component],
})
export class SettingsV2Module {}
