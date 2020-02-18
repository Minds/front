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
import { ReferralsModule } from '../wallet/tokens/referrals/referrals.module';

import { SettingsComponent } from './settings.component';
import { SettingsGeneralComponent } from './general/general.component';
import { SettingsDisableChannelComponent } from './disable/disable.component';
import { SettingsTwoFactorComponent } from './two-factor/two-factor.component';
import { SettingsSubscriptionsComponent } from './subscriptions/subscriptions.component';
import { SettingsEmailsComponent } from './emails/emails.component';
import { SettingsBillingComponent } from './billing/billing.component';
import { SettingsBillingSavedCardsComponent } from './billing/saved-cards/saved-cards.component';
import { SettingsBillingSubscriptionsComponent } from './billing/subscriptions/subscriptions.component';
import { SettingsReportedContentComponent } from './reported-content/reported-content.component';
import { SettingsService } from './settings.service';
import { SettingsWireComponent } from './wire/wire.component';
import { WireModule } from '../wire/wire.module';
import { SettingsBlockedChannelsComponent } from './blocked-channels/blocked-channels.component';
import { SettingsTiersComponent } from './tiers/tiers.component';

const settingsRoutes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'general', pathMatch: 'full' },
      { path: 'general/:card', component: SettingsGeneralComponent },
      { path: 'general', component: SettingsGeneralComponent },
      { path: 'wire', component: SettingsWireComponent },
      { path: 'disable', component: SettingsDisableChannelComponent },
      { path: 'twoFactor', component: SettingsTwoFactorComponent },
      { path: 'emails', component: SettingsEmailsComponent },
      { path: 'billing', component: SettingsBillingComponent },
      { path: 'reported-content', component: SettingsReportedContentComponent },
      { path: 'blocked-channels', component: SettingsBlockedChannelsComponent },
      { path: 'tiers', component: SettingsTiersComponent },
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
    RouterModule.forChild(settingsRoutes),
    ReportModule,
    PaymentsModule,
    WireModule,
    ReferralsModule,
  ],
  declarations: [
    SettingsComponent,
    SettingsGeneralComponent,
    SettingsDisableChannelComponent,
    SettingsTwoFactorComponent,
    SettingsSubscriptionsComponent,
    SettingsEmailsComponent,
    SettingsBillingComponent,
    SettingsBillingSavedCardsComponent,
    SettingsBillingSubscriptionsComponent,
    SettingsReportedContentComponent,
    SettingsWireComponent,
    SettingsBlockedChannelsComponent,
    SettingsTiersComponent,
  ],
  providers: [SettingsService],
  exports: [
    SettingsBillingSavedCardsComponent,
    SettingsBillingSubscriptionsComponent,
  ],
})
export class SettingsModule {}
