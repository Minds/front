import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdsModule } from '../ads/ads.module';

import { BoostConsoleComponent } from './console/console.component';
import { BoostConsoleTypesComponent } from './console/types.component';
import { BoostConsoleHistoryComponent } from './console/history.component';
import { BoostConsoleNetworkListComponent } from './console/list/network.component';
import { BoostConsoleP2PListComponent } from './console/list/p2p.component';
import { BoostConsoleCard } from './console/card/card.component';
import { BoostConsoleBooster } from './console/booster/booster.component';
import { BoostMarketingComponent } from './marketing.component';
import { MarketingModule } from '../marketing/marketing.module';

const boostRoutes: Routes = [
  {
    path: 'boost/console',
    component: BoostConsoleComponent,
    children: [
      { path: '', redirectTo: 'newsfeed/history', pathMatch: 'full' },
      {
        path: ':type',
        component: BoostConsoleTypesComponent,
        children: [
          { path: '', redirectTo: 'history', pathMatch: 'full' },
          { path: 'create', component: BoostConsoleBooster },
          { path: 'history', component: BoostConsoleHistoryComponent },
          { path: 'history/:filter', component: BoostConsoleHistoryComponent },
        ],
      },
    ],
  },
  {
    path: 'boost',
    component: BoostMarketingComponent,
    data: {
      title: 'Boost',
      description: 'Expand your reach and gain thousands of views',
      ogImage: '/assets/product-pages/boost/boost-1.jpg',
      preventLayoutReset: true,
    },
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(boostRoutes),
    CommonModule,
    AdsModule,
    MarketingModule,
  ],
  declarations: [
    BoostConsoleComponent,
    BoostConsoleNetworkListComponent,
    BoostConsoleP2PListComponent,
    BoostConsoleCard,
    BoostConsoleBooster,
    BoostConsoleTypesComponent,
    BoostConsoleHistoryComponent,
    BoostMarketingComponent,
  ],
  exports: [
    BoostConsoleNetworkListComponent,
    BoostConsoleP2PListComponent,
    BoostConsoleCard,
    BoostConsoleBooster,
  ],
})
export class BoostModule {}
