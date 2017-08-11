import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";

import { CommonModule } from "../../common/common.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CheckoutModule } from "../checkout/checkout.module";

import { WireCreatorComponent } from "./creator/creator.component";
import { WireButtonComponent } from "./button/button.component";
import { WireChannelComponent } from "./channel/channel.component";
import { WireChannelTableComponent } from "./channel/table/table.component";
import { WireCreatorRewardsComponent } from "./creator/rewards/rewards.component";
import { WireThresholdInputComponent } from "./threshold-input/threshold-input.component";
import { WireConsoleComponent } from './console/console.component';
import { WireConsoleLedgerComponent } from './console/ledger.component';
import { WireConsoleSupporterComponent } from './console/supporter/supporter.component';
import { WireConsoleSettingsComponent } from "./console/settings/settings.component";
import { WireLockScreenComponent } from './lock-screen/wire-lock-screen.component';

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
    CommonModule,
    CheckoutModule
  ],
  declarations: [
    WireLockScreenComponent,
    WireCreatorComponent,
    WireButtonComponent,
    WireChannelComponent,
    WireChannelTableComponent,
    WireCreatorRewardsComponent,
    WireThresholdInputComponent,
    WireConsoleComponent,
    WireConsoleLedgerComponent,
    WireConsoleSupporterComponent,
    WireConsoleSettingsComponent
  ],
  exports: [
    WireLockScreenComponent,
    WireButtonComponent,
    WireChannelComponent,
    WireThresholdInputComponent,
    WireConsoleLedgerComponent,
    WireConsoleSupporterComponent,
    WireConsoleSettingsComponent
  ],
  entryComponents: [
    WireCreatorComponent,
    WireConsoleComponent
  ]
})
export class WireModule {
}
