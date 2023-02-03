import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalsModule } from '../modals/modals.module';
import { CommonModule } from '../../common/common.module';
import { ReportModule } from '../report/report.module';
import { PaymentsModule } from '../payments/payments.module';
import { WireModule } from '../wire/wire.module';
import { YoutubeMigrationModule } from '../media/youtube-migration/youtube-migration.module';

import { CanDeactivateGuardService } from '../../services/can-deactivate-guard';

import { SettingsV2Component } from './settings-v2.component';
import { SettingsV2SessionsComponent } from './security/sessions/sessions.component';
import { SettingsV2TwoFactorComponent } from './security/two-factor/two-factor.component';
import { SettingsV2EmailAddressComponent } from './account/email-address/email-address.component';
import { SettingsV2LanguageComponent } from './account/language/language.component';
import { SettingsV2PasswordComponent } from './account/password/password.component';
import { SettingsV2NsfwContentComponent } from './account/nsfw-content/nsfw-content.component';
import { SettingsV2ShareButtonsComponent } from './account/share-buttons/share-buttons.component';
import { MindsFormsModule } from '../forms/forms.module';
import { SettingsV2Service } from './settings-v2.service';
import { SettingsV2PaymentMethodsComponent } from './payments/payment-methods/payment-methods.component';
import { SettingsV2RecurringPaymentsComponent } from './payments/recurring-payments/recurring-payments.component';
import { SettingsV2SupermindComponent } from './payments/supermind/supermind.component';
import { SettingsV2ReportedContentComponent } from './other/reported-content/reported-content.component';
import { SettingsV2BlockedChannelsComponent } from './other/blocked-channels/blocked-channels.component';
import { SettingsV2SubscriptionTiersComponent } from './other/subscription-tiers/subscription-tiers.component';
import { SettingsV2DeactivateAccountComponent } from './other/deactivate-account/deactivate-account.component';
import { SettingsV2DeleteAccountComponent } from './other/delete-account/delete-account.component';
import { WalletV2Service } from '../wallet/components/wallet-v2.service';
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
import { YoutubeMigrationConnectComponent } from '../media/youtube-migration/connect/connect.component';
import { YoutubeMigrationConfigComponent } from '../media/youtube-migration/config/config.component';
import { YoutubeMigrationComponent } from '../media/youtube-migration/youtube-migration.component';
import { ReferralsV2Module } from './other/referrals/referrals.module';
import { SettingsV2ReferralsComponent } from './other/referrals/referrals.component';
import { LanguageModule } from '../language/language.module';
import { SettingsV2I18nHack } from './settings-i18n-hack.component';
import { SettingsV2HeaderComponent } from './settings-header.component';
import { SettingsV2BoostedContentComponent } from './account/boosted-content/boosted-content.component';
import { NewsfeedModule } from '../newsfeed/newsfeed.module';
import { SettingsTwoFactorComponent } from '../settings/two-factor/two-factor.component';
import { SettingsReportedContentComponent } from '../settings/reported-content/reported-content.component';
import { SettingsTwoFactorV2BaseComponent } from './security/two-factor-v2/two-factor-v2-base.component';
import { SettingsTwoFactorPasswordComponent } from './security/two-factor-v2/confirm-password/confirm-password.component';
import { SettingsTwoFactorV2RootComponent } from './security/two-factor-v2/root/root.component';
import { SettingsTwoFactorRecoveryCodeComponent } from './security/two-factor-v2/recovery-codes/recovery-codes.component';
import { SettingsTwoFactorConnectAppComponent } from './security/two-factor-v2/connect-app/connect-app.component';
import { SettingsTwoFactorDisableTOTPComponent } from './security/two-factor-v2/confirm-disable/totp/confirm-disable-totp.component';
import { SettingsTwoFactorDisableSMSComponent } from './security/two-factor-v2/confirm-disable/sms/confirm-disable-sms.component';

import { SettingsTwoFactorCodePopupComponent } from './security/two-factor-v2/connect-app/code-popup/code-popup.component';
import { SettingsV2MessengerComponent } from './account/messenger/messenger.component';
import { MessengerModule } from '../messenger/messenger.module';
import { SettingsV2PushNotificationsV3Component } from './account/notifications-v3/push-notifications/push-notifications.component';
import { SettingsV2EmailNotificationsV3Component } from './account/notifications-v3/email-notifications-v3/email-notifications-v3.component';
import { SettingsV2ProfileComponent } from './account/profile/profile.component';
import { SettingsV2WalletComponent } from './other/wallet/wallet.component';
import { SettingsV2NostrComponent } from './account/nostr/nostr.component';
import { SupermindExperimentGuard } from '../experiments/guards/supermind-experiment.guard';
import { SettingsV2PaymentHistoryComponent } from './payments/payment-history/payment-history.component';
import { PathMatch } from '../../common/types/angular.types';

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
          ogImage: '/assets/og-images/settings-v3.png',
          ogImageWidth: 1200,
          ogImageHeight: 1200,
        },
        children: [
          {
            path: 'profile',
            component: SettingsV2ProfileComponent,
            data: {
              title: 'Profile',
              description: 'Customize your profile.',
              id: 'profile',
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
              id: 'email-address',
            },
          },
          {
            path: 'language',
            component: SettingsV2LanguageComponent,
            data: {
              title: 'Language Settings',
              description:
                'Change your preferred language and, if available, the web interface display.',
              id: 'language',
            },
          },
          {
            path: 'password',
            component: SettingsV2PasswordComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Password',
              description: 'Change account password.',
              id: 'password',
            },
          },
          {
            path: 'boosted-content',
            component: SettingsV2BoostedContentComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Boosted Content',
              description: 'Control how boosted content is displayed.',
              id: 'boosted-content',
            },
          },
          {
            path: 'nsfw-content',
            component: SettingsV2NsfwContentComponent,
            data: {
              title: 'NSFW Content',
              description:
                'Control how NSFW content is displayed in your newsfeed.',
              id: 'nsfw-content',
            },
          },
          {
            path: 'share-buttons',
            component: SettingsV2ShareButtonsComponent,
            data: {
              title: 'Share Buttons',
              description: 'Control whether you see the share button overlay.',
              id: 'share-buttons',
            },
          },
          {
            path: 'autoplay-videos',
            component: SettingsV2AutoplayVideosComponent,
            data: {
              title: 'Autoplay Videos',
              id: 'autoplay-videos',
            },
          },
          {
            path: 'push-notifications',
            component: SettingsV2PushNotificationsV3Component,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Push Notifications',
              description:
                'Control what push notifications you receive, and when.',
              id: 'push-notifications',
            },
          },
          {
            path: 'email-notifications',
            component: SettingsV2EmailNotificationsV3Component,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Email Notifications',
              description:
                'Control what push notifications you receive, and when.',
              id: 'email-notifications',
            },
          },
          {
            path: 'messenger',
            component: SettingsV2MessengerComponent,
            data: {
              title: 'Messenger',
              description:
                'Choose whether you want to see the legacy messenger.',
              id: 'messenger',
            },
          },
          {
            path: 'nostr',
            component: SettingsV2NostrComponent,
            data: {
              title: 'Nostr',
              description:
                'Configure your channel to interface outside of the Minds network.',
              id: 'nostr',
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
              id: 'two-factor',
            },
          },
          {
            path: 'sessions',
            component: SettingsV2SessionsComponent,
            data: {
              title: 'Sessions',
              description:
                'Manage the devices that have been granted access to your account',
              id: 'sessions',
            },
          },
        ],
      },
      /**
       * Changed parent route from billing to payments for front#5712
       * The 3 redirects below are to ensure that we do not break any
       * lingering direct navigation attempts.
       */
      {
        path: 'billing/payment-methods',
        redirectTo: 'payments/payment-methods',
      },
      {
        path: 'billing/recurring-payments',
        redirectTo: 'payments/recurring-payments',
      },
      {
        path: 'billing',
        redirectTo: 'payments',
      },
      {
        path: 'payments',
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
              id: 'payment-methods',
            },
          },
          {
            path: 'payment-history',
            component: SettingsV2PaymentHistoryComponent,
            data: {
              title: 'Payment History',
              description: 'Track payments you make on Minds',
              id: 'payment-history',
            },
          },
          {
            path: 'recurring-payments',
            component: SettingsV2RecurringPaymentsComponent,
            data: {
              title: 'Recurring Payments',
              description:
                'Track recurring payments you make to support other channels.',
              id: 'recurring-payments',
            },
          },
          {
            path: 'supermind',
            component: SettingsV2SupermindComponent,
            canActivate: [SupermindExperimentGuard],
            data: {
              title: 'Supermind',
              description: 'Manage Supermind settings',
              id: 'supermind',
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
            path: 'referrals',
            component: SettingsV2ReferralsComponent,
            data: {
              title: 'Referrals',
              description:
                'If your friend signs up for Minds within 24 hours of clicking the link you shared with them, they’ll be added to your pending referrals. Once they sign up for the rewards program by setting up their Minds wallet, the referral is complete and you’ll both get +1 added to your contribution scores!',
              id: 'referrals',
            },
          },
          {
            path: 'wallet',
            component: SettingsV2WalletComponent,
            data: {
              title: 'Wallet',
              description: 'Your wallet privacy settings',
              id: 'wallet',
            },
          },
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
              id: 'reported-content',
            },
          },
          {
            path: 'blocked-channels',
            component: SettingsV2BlockedChannelsComponent,
            data: {
              title: 'Blocked Channels',
              description: 'Block channels from appearing in your feed.',
              id: 'blocked-channels',
            },
          },
          {
            path: 'subscription-tiers',
            component: SettingsV2SubscriptionTiersComponent,
            data: {
              title: 'Subscription Tiers',
              description:
                "Define incentives for users to support your channel. These tiers will be displayed on your channel's sidebar and wire screen.",
              id: 'subscription-tiers',
            },
          },
          {
            path: 'youtube-migration',
            component: YoutubeMigrationComponent,
            data: {
              title: 'Youtube Migration',
              standardHeader: false,
            },
            children: [
              // These child routes are reached with a skipLocationChange in the YoutubeMigrationComponent
              {
                path: 'connect',
                component: YoutubeMigrationConnectComponent,
              },
              {
                path: 'dashboard',
                component: YoutubeMigrationConfigComponent,
              },
            ],
          },
          {
            path: 'twitter-sync',
            loadChildren: () =>
              import('../newsfeed/twitter-sync/twitter-sync.module').then(
                m => m.TwitterSyncModule
              ),
            data: {
              title: 'Twitter Sync',
              standardHeader: false,
            },
          },
          {
            path: 'deactivate-account',
            component: SettingsV2DeactivateAccountComponent,
            data: {
              title: 'Deactivate Account',
              description:
                'Deactivating your account will make your profile invisible. You will also not receive emails or notifications. Your username will be reserved in case you return to Minds.',
              id: 'deactivate-account',
            },
          },
          {
            path: 'delete-account',
            component: SettingsV2DeleteAccountComponent,
            data: {
              title: 'Delete Account',
              description:
                'Warning: This is not reversible and will result in permanent loss of your channel and all of your data. Your channel will not be recoverable.',
              id: 'delete-account',
            },
          },
        ],
      },
      { path: 'canary', redirectTo: 'account' },
      {
        path: '',
        component: SettingsV2Component,
        pathMatch: 'full' as PathMatch,
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full' as PathMatch,
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
    ModalsModule,
    RouterModule.forChild(SETTINGS_V2_ROUTES),
    ReportModule,
    PaymentsModule,
    WireModule,
    MindsFormsModule,
    // WalletV2Module,
    ProModule,
    YoutubeMigrationModule,
    ReferralsV2Module,
    LanguageModule,
    NewsfeedModule,
    MessengerModule,
  ],
  declarations: [
    SettingsV2Component,
    SettingsV2SessionsComponent,
    SettingsV2TwoFactorComponent,
    SettingsV2EmailAddressComponent,
    SettingsV2LanguageComponent,
    SettingsV2PasswordComponent,
    SettingsV2EmailNotificationsV3Component,
    SettingsV2PushNotificationsV3Component,
    SettingsV2NsfwContentComponent,
    SettingsV2ShareButtonsComponent,
    SettingsV2PaymentMethodsComponent,
    SettingsV2PaymentHistoryComponent,
    SettingsV2RecurringPaymentsComponent,
    SettingsV2SupermindComponent,
    SettingsV2ReportedContentComponent,
    SettingsV2BlockedChannelsComponent,
    SettingsV2SubscriptionTiersComponent,
    SettingsV2DeactivateAccountComponent,
    SettingsV2DeleteAccountComponent,
    SettingsV2ProGeneralComponent,
    SettingsV2ProThemeComponent,
    SettingsV2ProAssetsComponent,
    SettingsV2ProHashtagsComponent,
    SettingsV2ProFooterComponent,
    SettingsV2ProDomainComponent,
    SettingsV2ProPayoutsComponent,
    SettingsV2ProCancelComponent,
    SettingsV2AutoplayVideosComponent,
    SettingsV2I18nHack,
    SettingsV2HeaderComponent,
    SettingsV2BoostedContentComponent,
    SettingsTwoFactorV2BaseComponent,
    SettingsTwoFactorPasswordComponent,
    SettingsTwoFactorV2RootComponent,
    SettingsTwoFactorRecoveryCodeComponent,
    SettingsTwoFactorConnectAppComponent,
    SettingsTwoFactorDisableSMSComponent,
    SettingsTwoFactorDisableTOTPComponent,
    SettingsTwoFactorCodePopupComponent,
    SettingsV2ProfileComponent,
    // These need moving to settings folder
    SettingsTwoFactorComponent,
    SettingsReportedContentComponent,
    //
    SettingsV2MessengerComponent,
    SettingsV2WalletComponent,
    SettingsV2NostrComponent,
  ],
  providers: [SettingsV2Service, WalletV2Service],
  exports: [SettingsV2Component],
})
export class SettingsV2Module {}
