import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '../../common/common.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { UpgradesComponent } from './upgrades.component';
import { UpgradeOptionsComponent } from './upgrade-options.component';
import { BuyTokensComponent } from './buy-tokens.component';

export const routes = [
  { path: 'upgrade', pathMatch: 'full', redirectTo: 'upgrades' },
  {
    path: 'upgrades',
    component: UpgradesComponent,
    data: {
      title: 'Upgrade your Minds experience',
      description:
        'Minds offers a unique range of powerful upgrades that will supercharge your Minds experience',
      ogImage: '/assets/marketing/upgrades-1.jpg',
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BlockchainModule,
  ],
  declarations: [
    UpgradesComponent,
    UpgradeOptionsComponent,
    BuyTokensComponent,
  ],
})
export class UpgradesModule {}
