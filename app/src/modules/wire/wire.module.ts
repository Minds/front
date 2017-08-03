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
    WireCreatorComponent,
    WireButtonComponent,
    WireChannelComponent,
    WireChannelTableComponent,
    WireCreatorRewardsComponent,
    WireThresholdInputComponent
  ],
  exports: [
    WireButtonComponent,
    WireChannelComponent,
    WireThresholdInputComponent
  ],
  entryComponents: [
    WireCreatorComponent
  ]
})
export class WireModule {
}
