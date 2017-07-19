import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";

import { CommonModule } from "../../common/common.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CheckoutModule } from "../checkout/checkout.module";
import { ThirdPartyNetworksModule } from "../third-party-networks/third-party-networks.module";
import { AdsModule } from "../ads/ads.module";

import { BoostsComponent } from "./boosts.component";
import { OverlayBoostModal } from "./overlay-modal/overlay-modal.component";

import { BoostConsoleComponent } from "./console/console.component";
import { BoostConsoleNetworkListComponent } from "./console/list/network.component";
import { BoostConsoleP2PListComponent } from "./console/list/p2p.component";
import { BoostConsoleCard } from "./console/card/card.component";
import { BoostConsoleBooster } from "./console/booster/booster.component";


// TODO: Deprecate old console
const routes: Routes = [
  { path: 'boosts/:type/:filter', component: BoostsComponent },
  { path: 'boosts/:type', component: BoostsComponent },
  { path: 'boosts', component: BoostsComponent },
];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CommonModule,
    CheckoutModule,
    ThirdPartyNetworksModule,
    AdsModule,
  ],
  declarations: [
    BoostsComponent,
    OverlayBoostModal,
    BoostConsoleComponent,
    BoostConsoleNetworkListComponent,
    BoostConsoleP2PListComponent,
    BoostConsoleCard,
    BoostConsoleBooster
  ],
  exports: [
    BoostsComponent,
    OverlayBoostModal,
    BoostConsoleComponent,
    BoostConsoleNetworkListComponent,
    BoostConsoleP2PListComponent,
    BoostConsoleCard,
    BoostConsoleBooster
  ],
  entryComponents: [
    OverlayBoostModal,
    BoostConsoleComponent
  ]
})
export class BoostModule {
}
