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
import { SettingsV2NotificationsComponent } from './account/notifications/notifications.component';
import { SettingsV2NsfwContentComponent } from './account/nsfw-content/nsfw-content.component';
import { SettingsV2ShareButtonsComponent } from './account/share-buttons/share-buttons.component';

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
            path: 'notifications',
            component: SettingsV2NotificationsComponent,
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Notifications',
              description: 'Change what notifications you receive, and when.',
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
          // TODOOJM do something about upgrade to pro/plus
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
            canDeactivate: [CanDeactivateGuardService],
            data: {
              title: 'Sessions',
              description: 'Close all sessions with a single click.',
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
    ModalsModule, // todoojm where is this used?
    LegacyModule,
    RouterModule.forChild(SETTINGS_V2_ROUTES),
    ReportModule,
    PaymentsModule,
    WireModule,
    // SettingsModule,
  ],
  declarations: [
    SettingsV2Component,
    SettingsV2DisplayNameComponent,
    SettingsV2SessionsComponent,
    SettingsV2TwoFactorComponent,
    SettingsV2EmailAddressComponent,
    SettingsV2DisplayLanguageComponent,
    SettingsV2PasswordComponent,
    SettingsV2NotificationsComponent,
    SettingsV2NsfwContentComponent,
    SettingsV2ShareButtonsComponent,
  ],
  // providers: [SettingsService],
  exports: [
    SettingsV2Component,
    // SettingsBillingSavedCardsComponent,
    // SettingsBillingSubscriptionsComponent,
  ],
})
export class SettingsV2Module {}
