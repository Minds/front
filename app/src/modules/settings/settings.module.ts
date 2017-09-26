import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CheckoutModule } from '../checkout/checkout.module';
import { ModalsModule } from '../modals/modals.module';
import { CommonModule } from '../../common/common.module';
import { LegacyModule } from '../legacy/legacy.module';
import { ReportModule } from '../report/report.module';
import { SettingsBillingComponent } from './billing/billing.component';
import { SettingsBillingSavedCardsComponent } from './billing/saved-cards/saved-cards.component';
import { SettingsBillingSubscriptionsComponent } from './billing/subscriptions/subscriptions.component';
import { SettingsNavigationComponent } from './navigation/navigation.component';
import { SettingsReportedContentComponent } from './reported-content/reported-content.component';

const settingsRoutes : Routes = [
  { path: 'settings/billing',  component: SettingsBillingComponent },
  { path: 'settings/reported-content',  component: SettingsReportedContentComponent }
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
    ReportModule
  ],
  declarations: [
    SettingsBillingComponent,
    SettingsBillingSavedCardsComponent,
    SettingsBillingSubscriptionsComponent,
    SettingsNavigationComponent,
    SettingsReportedContentComponent,
    //BillingComponent
  ],
  exports: [
    SettingsBillingSavedCardsComponent,
    SettingsBillingSubscriptionsComponent,
    SettingsNavigationComponent
  ],
  entryComponents: [
    SettingsNavigationComponent
  ]
})

export class SettingsModule {}
