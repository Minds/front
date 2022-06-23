import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentsModule } from '../payments/payments.module';

import { WireButtonComponent } from './button/button.component';
import { WireLockScreenComponent } from './lock-screen/wire-lock-screen.component';
import { WireService } from './wire.service';
import { WirePaymentHandlersService } from './wire-payment-handlers.service';
import { PayMarketingComponent } from './marketing/marketing.component';
import { WireV2Module } from './v2/wire-v2.module';
import { WireModalService } from './wire-modal.service';
import { MarketingModule } from '../marketing/marketing.module';

const wireRoutes: Routes = [
  { path: 'wire', redirectTo: 'pay' },
  {
    path: 'pay',
    component: PayMarketingComponent,
    data: {
      title: 'Minds Pay (Wire)',
      description: 'Send and receive payments in USD, BTC, ETH and Tokens',
      ogImage: '/assets/og-images/pay-v3.png',
      ogImageWidth: 1200,
      ogImageHeight: 1200,
      preventLayoutReset: true,
    },
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(wireRoutes),
    CommonModule,
    PaymentsModule,
    WireV2Module,
    MarketingModule,
  ],
  declarations: [
    WireLockScreenComponent,
    WireButtonComponent,
    PayMarketingComponent,
  ],
  providers: [WireService, WirePaymentHandlersService, WireModalService],
  exports: [WireLockScreenComponent, WireButtonComponent],
})
export class WireModule {}
