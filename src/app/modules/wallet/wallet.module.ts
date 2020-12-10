import { NgModule, Injectable, Inject, APP_INITIALIZER } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { AdsModule } from '../ads/ads.module';
import { WireModule } from '../wire/wire.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { PlusModule } from '../plus/plus.module';

import { WalletToggleComponent } from './toggle.component';
import { TokenOnboardingModule } from './tokens/onboarding/onboarding.module';
import { ModalsModule } from '../modals/modals.module';
import { WalletV2Module } from './v2/wallet-v2.module';
import { WALLET_V2_ROUTES } from '../wallet/v2/wallet-v2.module';
import { ChartV2Module } from '../analytics/components/chart-v2/chart-v2.module';

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CheckoutModule,
    RouterModule,
    RouterModule.forChild([...WALLET_V2_ROUTES]),
    AdsModule,
    WireModule,
    BlockchainModule,
    TokenOnboardingModule,
    PlusModule,
    ModalsModule,
    WalletV2Module,
    ChartV2Module,
  ],
  declarations: [WalletToggleComponent],
  exports: [WalletToggleComponent],
})
export class WalletModule {}
