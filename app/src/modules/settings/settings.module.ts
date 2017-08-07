import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CheckoutModule } from '../checkout/checkout.module'
import { ModalsModule } from '../modals/modals.module'
import { CommonModule } from '../../common/common.module';
import { SettingsBillingComponent } from './billing/billing.component';
import { SettingsBillingSavedCardsComponent } from './billing/saved-cards/saved-cards.component';
import { SettingsNavigationComponent } from './navigation/navigation.component';


const settingsRoutes : Routes = [
  { path: 'settings/billing',  component: SettingsBillingComponent }
]

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CheckoutModule,
    ModalsModule,
    RouterModule.forChild(settingsRoutes)
  ],
  declarations: [
    SettingsBillingComponent,
    SettingsBillingSavedCardsComponent,
    SettingsNavigationComponent
    //BillingComponent
  ],
  exports: [
    SettingsBillingSavedCardsComponent,
    SettingsNavigationComponent
  ],
  entryComponents: [
    SettingsNavigationComponent
  ]
})

export class SettingsModule {}
