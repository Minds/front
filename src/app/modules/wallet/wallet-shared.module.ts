import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { WalletCurrencyValueComponent } from './components/components/currency-value/currency-value.component';
import { MindsWalletTokenPriceBadgeComponent } from './components/components/token-price-badge/token-price-badge.component';
import { ModalsModule } from '../modals/modals.module';
import { WalletPhoneVerificationComponent } from './components/components/phone-verification/phone-verification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    ModalsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    WalletCurrencyValueComponent,
    MindsWalletTokenPriceBadgeComponent,
    WalletPhoneVerificationComponent,
  ],
  exports: [WalletCurrencyValueComponent, MindsWalletTokenPriceBadgeComponent],
})
export class WalletSharedModule {}
