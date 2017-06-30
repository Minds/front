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


const walletRoutes : Routes = [
  { path: 'wallet', component: WalletComponent,
    children: [
      { path: '', redirectTo: 'transactions', pathMatch: 'full' },
      { path: 'transactions', component: WalletTransactionsComponent },
      { path: 'purchase', component: WalletTransactionsComponent }
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
    WalletPurchaseComponent
  ],
  exports: [
    WalletComponent,
    PointsOverviewComponent,
    WalletTransactionsComponent,
    WalletPointsTransactionsComponent,
    WalletPurchaseComponent
  ],
  entryComponents: [ WalletComponent ]
})

export class WalletModule {}
