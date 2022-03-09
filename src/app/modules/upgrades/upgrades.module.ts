import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '../../common/common.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { UpgradesComponent } from './upgrades.component';
import { UpgradeOptionsComponent } from './upgrade-options.component';
import { BuyTokensComponent } from './buy-tokens.component';
import { MarketingModule } from '../marketing/marketing.module';

export const routes = [
  { path: 'upgrade', pathMatch: 'full', redirectTo: 'upgrades' },
  {
    path: 'upgrades',
    component: UpgradesComponent,
    data: {
      title: 'Upgrade your social media experience',
      description:
        'Take your alternative social media to the next level and upgrade your Minds channel. Access exclusive content, build your own website, and make money for your work.',
      ogImage: '/assets/og-images/upgrade-v3.png',
      ogImageWidth: 1200,
      ogImageHeight: 1200,
      preventLayoutReset: true,
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
    MarketingModule,
  ],
  declarations: [
    UpgradesComponent,
    UpgradeOptionsComponent,
    BuyTokensComponent,
  ],
})
export class UpgradesModule {}
