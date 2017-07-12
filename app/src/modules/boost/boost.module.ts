import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";

import { CommonModule } from "../../common/common.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CheckoutModule } from "../checkout/checkout.module";
import { ThirdPartyNetworksModule } from "../third-party-networks/third-party-networks.module";

import { BoostsComponent } from "./boosts.component";
import { BoostModalComponent } from "./modal/modal.component";
import { BoostComponent } from "./boost/boost.component";
import { BoostP2PComponent } from "./boost/p2p/p2p.component";
import { BoostFullNetworkComponent } from "./boost/full-network/full-network.component";
import { OverlayBoostModal } from "./overlay-modal/overlay-modal.component";
import { AdsModule } from "../ads/ads.module";

import { GroupsModule } from "../../plugins/Groups/groups.module";
import { BlogModule } from "../../plugins/blog/blog.module";

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
    BoostModalComponent,
    BoostComponent,
    BoostP2PComponent,
    BoostFullNetworkComponent,
    OverlayBoostModal
  ],
  exports: [
    BoostsComponent,
    BoostModalComponent,
    BoostComponent,
    BoostP2PComponent,
    BoostFullNetworkComponent,
    OverlayBoostModal
  ],
  entryComponents: [
    OverlayBoostModal
  ]
})
export class BoostModule {
}
