import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutModule } from '../checkout/checkout.module';
import { FaqModule } from '../faq/faq.module';
import { PaymentsModule } from '../payments/payments.module';

import { WireCreatorComponent } from './creator/creator.component';
import { WireButtonComponent } from './button/button.component';
import { WireChannelComponent } from './channel/channel.component';
import { WireChannelTableComponent } from './channel/table/table.component';
import { WireChannelOverviewComponent } from './channel/overview/overview.component';
import { WireCreatorRewardsComponent } from './creator/rewards/rewards.component';
import { WireThresholdInputComponent } from './threshold-input/threshold-input.component';
import { WireConsoleComponent } from './console/console.component';
import { WireConsoleLedgerComponent } from './console/ledger.component';
import { WireConsoleSupporterComponent } from './console/supporter/supporter.component';
import { WireConsoleSettingsComponent } from './console/settings/settings.component';
import { WireLockScreenComponent } from './lock-screen/wire-lock-screen.component';
import { WireService } from './wire.service';
import { WireConsoleOverviewComponent } from './console/overview/overview.component';
import { WireConsoleRewardsInputsComponent } from './console/rewards-table/inputs/wire-console-rewards-inputs.component';
import { WireConsoleRewardsComponent } from './console/rewards-table/rewards.component';
import { WireSubscriptionTiersComponent } from './channel/tiers.component';
import { WirePaymentsCreatorComponent } from './creator/payments/payments.creator.component';
import { WirePaymentHandlersService } from './wire-payment-handlers.service';
import { PayMarketingComponent } from './marketing/marketing.component';

const wireRoutes: Routes = [
  { path: 'wire', redirectTo: 'pay' },
  {
    path: 'pay',
    component: PayMarketingComponent,
    data: {
      title: 'Minds Pay (Wire)',
      description: 'Send and receive payments in USD, BTC, ETH and Tokens',
      ogImage: '/assets/product-pages/pay/pay-1.jpg',
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
    CheckoutModule,
    FaqModule,
    PaymentsModule,
  ],
  declarations: [
    WireLockScreenComponent,
    WireCreatorComponent,
    WireButtonComponent,
    WireChannelComponent,
    WireChannelTableComponent,
    WireChannelOverviewComponent,
    WireCreatorRewardsComponent,
    WireThresholdInputComponent,
    WireConsoleRewardsInputsComponent,
    WireConsoleRewardsComponent,
    WirePaymentsCreatorComponent,
    WireConsoleComponent,
    WireConsoleLedgerComponent,
    WireConsoleSupporterComponent,
    WireConsoleSettingsComponent,
    PayMarketingComponent,
    WireConsoleOverviewComponent,
    WireSubscriptionTiersComponent,
  ],
  providers: [WireService, WirePaymentHandlersService],
  exports: [
    WireLockScreenComponent,
    WireButtonComponent,
    WireChannelComponent,
    WireChannelOverviewComponent,
    WireThresholdInputComponent,
    WireConsoleLedgerComponent,
    WireConsoleSupporterComponent,
    WireConsoleRewardsInputsComponent,
    WireConsoleRewardsComponent,
    WireConsoleSettingsComponent,
    WireConsoleOverviewComponent,
    WireCreatorComponent,
    WireSubscriptionTiersComponent,
  ],
  entryComponents: [
    WireCreatorComponent,
    WireConsoleComponent,
    WirePaymentsCreatorComponent,
    WireLockScreenComponent,
    WireConsoleRewardsInputsComponent,
  ],
})
export class WireModule {}
