import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { MonetizationOverviewModule } from '../monetization/monetization.overview.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { WalletComponent } from './wallet.component';
import { PointsOverviewComponent } from './points-overview.component';
import { WalletTransactionsComponent } from './transactions/transactions.component';
import { WalletPointsTransactionsComponent } from './transactions/points.component';
import { WalletPurchaseComponent } from './purchase/purchase.component';
import { WalletAdSharingComponent } from './ad-sharing/ad-sharing.component';
import { WalletAdSharingAnalyticsComponent } from './ad-sharing/analytics/analytics.component';
import { WalletAdSharingSettingsComponent } from './ad-sharing/settings/settings.component';
import { MerchantsComponent } from './merchants/merchants.component';


const walletRoutes : Routes = [
  { path: 'wallet', component: WalletComponent,
    children: [
      { path: '', redirectTo: 'transactions', pathMatch: 'full' },
      { path: 'transactions', component: WalletTransactionsComponent },
      { path: 'purchase', component: WalletTransactionsComponent },
      { path: 'ad-sharing', component: WalletAdSharingComponent },
      { path: 'merchants', component: MerchantsComponent }
    ]
  }
]

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CheckoutModule,
    MonetizationOverviewModule,
    RouterModule.forChild(walletRoutes)
  ],
  declarations: [
    WalletComponent,
    PointsOverviewComponent,
    WalletTransactionsComponent,
    WalletPointsTransactionsComponent,
    WalletPurchaseComponent,
    WalletAdSharingComponent,
    WalletAdSharingAnalyticsComponent,
    WalletAdSharingSettingsComponent,
    MerchantsComponent
  ],
  exports: [
    WalletComponent,
    PointsOverviewComponent,
    WalletTransactionsComponent,
    WalletPointsTransactionsComponent,
    WalletPurchaseComponent,
    WalletAdSharingComponent,
    WalletAdSharingAnalyticsComponent,
    WalletAdSharingSettingsComponent,
    MerchantsComponent
  ],
  entryComponents: [ WalletComponent ]
})

export class WalletModule {}
