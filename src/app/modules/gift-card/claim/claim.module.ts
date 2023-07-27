import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { RouterModule, Routes } from '@angular/router';
import { GiftCardClaimComponent } from './claim.component';
import { PathMatch } from '../../../common/types/angular.types';
import { GiftCardClaimRedeemPanelComponent } from './panels/redeem/redeem-panel.component';
import { GiftCardClaimSuccessPanelComponent } from './panels/success-panel/success-panel.component';
import { GiftCardClaimLoggedOutPanelComponent } from './panels/logged-out/logged-out-panel.component';
import { GiftCardSharedModule } from '../gift-card.shared.module';
import { GiftCardClaimExperimentGuard } from '../../experiments/guards/gift-card-claim-experiment.guard';

const routes: Routes = [
  {
    path: '', // '/gift-cards/claim'
    redirectTo: '/',
    pathMatch: 'full' as PathMatch,
  },
  {
    path: ':claimCode', // // '/gift-cards/claim/:claimCode'
    canActivate: [GiftCardClaimExperimentGuard],
    component: GiftCardClaimComponent,
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild(routes),
    GiftCardSharedModule,
  ],
  declarations: [
    GiftCardClaimComponent,
    GiftCardClaimRedeemPanelComponent,
    GiftCardClaimSuccessPanelComponent,
    GiftCardClaimLoggedOutPanelComponent,
  ],
})
export class GiftCardClaimModule {}
