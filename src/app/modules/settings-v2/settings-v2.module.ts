import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CheckoutModule } from '../checkout/checkout.module';
/// // import { ModalsModule } from '../modals/modals.module';
import { CommonModule } from '../../common/common.module';
import { LegacyModule } from '../legacy/legacy.module';
import { ReportModule } from '../report/report.module';
import { PaymentsModule } from '../payments/payments.module';
import { WireModule } from '../wire/wire.module';

// // import { ReferralsModule } from '../wallet/tokens/referrals/referrals.module';
// import { SettingsService } from './settings.service';

import { SettingsV2Component } from './settings-v2.component';
import { SettingsV2DisplayNameComponent } from './account/display-name/display-name.component';
import { SettingsV2SessionsComponent } from './security/sessions/sessions.component';
import { SettingsV2TwoFactorComponent } from './security/two-factor/two-factor.component';
import { SettingsModule } from '../settings/settings.module';
// import { SettingsGeneralComponent } from './general/general.component';
// import { SettingsDisableChannelComponent } from './disable/disable.component';
// import { SettingsTwoFactorComponent } from './two-factor/two-factor.component';
// import { SettingsSubscriptionsComponent } from './subscriptions/subscriptions.component';
// import { SettingsEmailsComponent } from './emails/emails.component';
// import { SettingsBillingComponent } from './billing/billing.component';
// import { SettingsBillingSavedCardsComponent } from './billing/saved-cards/saved-cards.component';
// import { SettingsBillingSubscriptionsComponent } from './billing/subscriptions/subscriptions.component';
// import { SettingsReportedContentComponent } from './reported-content/reported-content.component';
// import { SettingsWireComponent } from './wire/wire.component';
// import { SettingsBlockedChannelsComponent } from './blocked-channels/blocked-channels.component';
// import { SettingsTiersComponent } from './tiers/tiers.component';

// export const WALLET_V2_ROUTES: Routes = [
//   {
//     path: '',
//     component: SettingsV2Component,
//     data: {
//       title: 'Settings',
//       description: 'Configure your Minds settings',
//       ogImage: '/assets/photos/network.jpg',
//     },
//     children: [
//       {
//         path: 'account',
//         component: SettingsV2AccountComponent,
//         children: [
//           // {
//           //   path: '',
//           //   redirectTo: 'overview',
//           //   pathMatch: 'full',
//           // },
//           {
//             path: 'overview',
//             component: WalletChartComponent,
//           },
//           {
//             path: 'transactions',
//             component: WalletTransactionsTokensComponent,
//           },
//           {
//             path: 'settings',
//             component: WalletSettingsTokensComponent,
//           },
//         ],
//       },
//       {
//         path: 'cash',
//         component: WalletV2CashComponent,
//         children: [
//           {
//             path: 'transactions',
//             component: WalletTransactionsCashComponent,
//           },
//           {
//             path: 'settings',
//             component: WalletSettingsCashComponent,
//           },
//         ],
//       },
//       {
//         path: 'eth',
//         component: WalletV2EthComponent,
//         children: [
//           {
//             path: '',
//             redirectTo: 'settings',
//           },
//           {
//             path: 'settings',
//             component: WalletSettingsETHComponent,
//           },
//         ],
//       },
//       {
//         path: 'btc',
//         component: WalletV2BtcComponent,
//         children: [
//           {
//             path: '',
//             redirectTo: 'settings',
//           },
//           {
//             path: 'settings',
//             component: WalletSettingsBTCComponent,
//           },
//         ],
//       },
//       {
//         path: '**',
//         redirectTo: 'tokens',
//       },
//     ],
//   },
// ];

const SETTINGS_V2_ROUTES: Routes = [
  {
    path: '',
    component: SettingsV2Component,
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
        children: [
          { path: 'displayName', component: SettingsV2DisplayNameComponent },
        ],
      },
      {
        path: 'security',
        component: SettingsV2Component,
        children: [
          { path: 'twoFactor', component: SettingsV2TwoFactorComponent },
          { path: 'sessions', component: SettingsV2SessionsComponent },
        ],
      },
      {
        path: '**',
        redirectTo: 'account',
      },
      //   { path: 'wire', component: SettingsWireComponent },
      //   { path: 'disable', component: SettingsDisableChannelComponent },
      //   { path: 'twoFactor', component: SettingsTwoFactorComponent },
      //   { path: 'emails', component: SettingsEmailsComponent },
      //   { path: 'billing', component: SettingsBillingComponent },
      //   { path: 'reported-content', component: SettingsReportedContentComponent },
      //   { path: 'blocked-channels', component: SettingsBlockedChannelsComponent },
      //   { path: 'tiers', component: SettingsTiersComponent },
    ],
  },
];

// const routes: Routes = [
//   {
// TODOOJM leave this path empty for lazy loader
//     path: '',
//     component: AnalyticsComponent,
//     children: [
//       { path: '', redirectTo: 'dashboard/traffic', pathMatch: 'full' },
//       {
//         path: 'dashboard',
//         redirectTo: 'dashboard/traffic',
//         pathMatch: 'full',
//       },
//       {
//         path: 'dashboard/:category',
//         component: AnalyticsDashboardComponent,
//         data: {
//           title: 'Analytics',
//           description:
//             'Track your traffic, earnings, engagement and trending analytics',
//           ogImage: '/assets/photos/network.jpg',
//         },
//       },
//     ],
//   },
// ];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CheckoutModule,
    // ModalsModule,
    LegacyModule,
    RouterModule.forChild(SETTINGS_V2_ROUTES),
    ReportModule,
    PaymentsModule,
    WireModule,
    SettingsModule,
  ],
  declarations: [
    SettingsV2Component,
    SettingsV2DisplayNameComponent,
    SettingsV2SessionsComponent,
    SettingsV2TwoFactorComponent,
    // SettingsGeneralComponent,
    // SettingsDisableChannelComponent,
    // SettingsTwoFactorComponent,
    // SettingsSubscriptionsComponent,
    // SettingsEmailsComponent,
    // SettingsBillingComponent,
    // SettingsBillingSavedCardsComponent,
    // SettingsBillingSubscriptionsComponent,
    // SettingsReportedContentComponent,
    // SettingsWireComponent,
    // SettingsBlockedChannelsComponent,
    // SettingsTiersComponent,
  ],
  // providers: [SettingsService],
  exports: [
    SettingsV2Component,
    // SettingsBillingSavedCardsComponent,
    // SettingsBillingSubscriptionsComponent,
  ],
})
export class SettingsV2Module {}
