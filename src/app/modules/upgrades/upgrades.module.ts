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
  { path: 'upgrades', component: UpgradesComponent },
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
