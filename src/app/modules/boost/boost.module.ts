import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdsModule } from '../ads/ads.module';
import { MarketingModule } from '../marketing/marketing.module';
import { BoostConsoleV2Component } from './console-v2/console-v2.component';
import { BoostConsoleFilterBarComponent } from './console-v2/list/filter-bar/filter-bar.component';
import { BoostConsoleListComponent } from './console-v2/list/list.component';
import { BoostConsoleListItemComponent } from './console-v2/list/list-item/list-item.component';
import { BoostConsoleStateLabelComponent } from './console-v2/list/list-item/state-label/state-label.component';
import { BoostConsoleActionButtonsComponent } from './console-v2/list/list-item/action-buttons/action-buttons.component';
import { BoostConsoleService } from './console-v2/services/console.service';
import { BoostConsoleStatsBarComponent } from './console-v2/list/list-item/stats-bar/stats-bar.component';
import { ActivityModule } from '../newsfeed/activity/activity.module';
import { BoostConsoleSingleComponent } from './console-v2/single/single.component';
import { NoticesModule } from '../notices/notices.module';
import { MarkdownModule } from 'ngx-markdown';
import { BoostConsoleFeedComponent } from './console-v2/feed/feed.component';
import { loggedOutExplainerScreenGuard } from '../explainer-screens/guards/logged-out-explainer-screen.guard';
import { TenantRedirectGuard } from '../../common/guards/tenant-redirect.guard';

const boostRoutes: Routes = [
  {
    path: 'boost/boost-console',
    component: BoostConsoleV2Component,
    canActivate: [TenantRedirectGuard, loggedOutExplainerScreenGuard()],
    data: {
      title: 'Boost Console',
      description: 'Manage and monitor your boosts',
      ogImage: '/assets/product-pages/boost/boost-1.jpg',
    },
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(boostRoutes),
    MarkdownModule.forRoot(),
    CommonModule,
    AdsModule,
    MarketingModule,
    ActivityModule,
    NoticesModule,
  ],
  declarations: [
    BoostConsoleV2Component,
    BoostConsoleFilterBarComponent,
    BoostConsoleListComponent,
    BoostConsoleListItemComponent,
    BoostConsoleStateLabelComponent,
    BoostConsoleActionButtonsComponent,
    BoostConsoleStatsBarComponent,
    BoostConsoleSingleComponent,
    BoostConsoleFeedComponent,
  ],
  exports: [BoostConsoleV2Component],
  providers: [BoostConsoleService],
})
export class BoostModule {}
