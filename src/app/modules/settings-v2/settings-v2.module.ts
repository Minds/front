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

import { SettingsV2Component } from './settings-v2.component';
import { SettingsV2DisplayNameComponent } from './account/display-name/display-name.component';
import { SettingsV2SessionsComponent } from './security/sessions/sessions.component';
import { SettingsV2TwoFactorComponent } from './security/two-factor/two-factor.component';
import { SettingsV2EmailAddressComponent } from './account/email-address/email-address.component';

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
            data: {
              title: 'Display Name',
              description: 'Customize your display name.',
            },
          },
          {
            path: 'email-address',
            component: SettingsV2EmailAddressComponent,
            data: {
              title: 'Email Address',
              description:
                'Change the email address where notifications are sent.',
            },
          },
          // { path: '**', redirectTo: '' },
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
  ],
  // providers: [SettingsService],
  exports: [
    SettingsV2Component,
    // SettingsBillingSavedCardsComponent,
    // SettingsBillingSubscriptionsComponent,
  ],
})
export class SettingsV2Module {}
