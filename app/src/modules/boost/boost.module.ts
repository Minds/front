import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutModule } from '../checkout/checkout.module';
import { ThirdPartyNetworksModule } from '../third-party-networks/third-party-networks.module';
import { AdsModule } from '../ads/ads.module';

import { BoostCreatorComponent } from './creator/creator.component';
import { BoostCreatorPaymentMethodsComponent } from './creator/payment-methods/payment-methods.component';
import { BoostCreatorCheckoutComponent } from './creator/checkout/checkout.component';
import { BoostCreatorP2PSearchComponent } from './creator/p2p-search/p2p-search.component';
import { BoostCreatorCategoriesComponent } from './creator/categories/categories.component';

import { BoostConsoleComponent } from './console/console.component';
import { BoostConsoleNetworkListComponent } from './console/list/network.component';
import { BoostConsoleP2PListComponent } from './console/list/p2p.component';
import { BoostConsoleCard } from './console/card/card.component';
import { BoostConsoleBooster } from './console/booster/booster.component';
import { BoostMarketingComponent } from './marketing.component';

const boostRoutes: Routes = [
  { path: 'boost', component: BoostMarketingComponent }
];


@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(boostRoutes),
    CommonModule,
    CheckoutModule,
    ThirdPartyNetworksModule,
    AdsModule,
  ],
  declarations: [
    BoostCreatorComponent,
    BoostConsoleComponent,
    BoostConsoleNetworkListComponent,
    BoostConsoleP2PListComponent,
    BoostConsoleCard,
    BoostConsoleBooster,
    BoostMarketingComponent,
    BoostCreatorPaymentMethodsComponent,
    BoostCreatorCheckoutComponent,
    BoostCreatorP2PSearchComponent,
    BoostCreatorCategoriesComponent,
  ],
  exports: [
    BoostConsoleNetworkListComponent,
    BoostConsoleP2PListComponent,
    BoostConsoleCard,
    BoostConsoleBooster
  ],
  entryComponents: [
    BoostCreatorComponent,
    BoostConsoleComponent,
    BoostMarketingComponent
  ]
})
export class BoostModule {
}
