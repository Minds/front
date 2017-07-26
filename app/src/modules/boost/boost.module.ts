import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";

import { CommonModule } from "../../common/common.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CheckoutModule } from "../checkout/checkout.module";
import { ThirdPartyNetworksModule } from "../third-party-networks/third-party-networks.module";
import { AdsModule } from "../ads/ads.module";

import { BoostCreatorComponent } from "./creator/creator.component";

import { BoostConsoleComponent } from "./console/console.component";
import { BoostConsoleNetworkListComponent } from "./console/list/network.component";
import { BoostConsoleP2PListComponent } from "./console/list/p2p.component";
import { BoostConsoleCard } from "./console/card/card.component";
import { BoostConsoleBooster } from "./console/booster/booster.component";


@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
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
    BoostConsoleBooster
  ],
  exports: [
    BoostConsoleNetworkListComponent,
    BoostConsoleP2PListComponent,
    BoostConsoleCard,
    BoostConsoleBooster
  ],
  entryComponents: [
    BoostCreatorComponent,
    BoostConsoleComponent
  ]
})
export class BoostModule {
}
