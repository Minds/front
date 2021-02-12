import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { WalletCurrencyValueComponent } from './components/components/currency-value/currency-value.component';
import { MindsWalletTokenPriceBadgeComponent } from './components/components/token-price-badge/token-price-badge.component';

@NgModule({
  imports: [NgCommonModule, CommonModule],
  declarations: [
    WalletCurrencyValueComponent,
    MindsWalletTokenPriceBadgeComponent,
  ],
  exports: [WalletCurrencyValueComponent, MindsWalletTokenPriceBadgeComponent],
})
export class WalletSharedModule {}
