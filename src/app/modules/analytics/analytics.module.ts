import { NgModule } from '@angular/core';

import { CommonModule } from '../../common/common.module';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsDashboardComponent } from './v2/dashboard.component';
import { AnalyticsLayoutChartComponent } from './v2/layouts/layout-chart/layout-chart.component';
import { AnalyticsLayoutSummaryComponent } from './v2/layouts/layout-summary/layout-summary.component';
import { AnalyticsFiltersComponent } from './v2/components/filters/filters.component';
import { AnalyticsChartComponent } from './v2/components/chart/chart.component';
import { AnalyticsTableComponent } from './v2/components/table/table.component';
import { AnalyticsDashboardService } from './v2/dashboard.service';
import { FormsModule } from '@angular/forms';
import { AnalyticsBenchmarkComponent } from './v2/components/benchmark/benchmark.component';
import { AnalyticsGlobalTokensComponent } from './global-tokens/global-tokens.component';
import { AnalyticsGlobalTokensMetricItemComponent } from './global-tokens/metric-item/metric-item.component';
import { WalletSharedModule } from '../wallet/wallet-shared.module';
import { AnalyticsTabsComponent } from './v2/components/tabs/tabs.component';
import { PathMatch } from '../../common/types/angular.types';
import { ChartV2Component } from './components/chart-v2/chart-v2.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/traffic',
    pathMatch: 'full' as PathMatch,
  },
  {
    path: 'dashboard/token',
    redirectTo: 'dashboard/traffic',
    pathMatch: 'full' as PathMatch,
  },
  {
    path: 'dashboard/token/:tabId',
    redirectTo: 'dashboard/traffic',
    pathMatch: 'full' as PathMatch,
  },
  {
    path: 'dashboard/:category',
    component: AnalyticsDashboardComponent,
    data: {
      title: 'Analytics',
      description:
        'Track your traffic, earnings, engagement and trending analytics',
      ogImage: '/assets/og-images/analytics-v3.png',
      ogImageWidth: 1200,
      ogImageHeight: 1200,
    },
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    WalletSharedModule,
    ChartV2Component,
  ],
  declarations: [
    AnalyticsDashboardComponent,
    AnalyticsLayoutChartComponent,
    AnalyticsLayoutSummaryComponent,
    AnalyticsFiltersComponent,
    AnalyticsChartComponent,
    AnalyticsTableComponent,
    AnalyticsBenchmarkComponent,
    AnalyticsGlobalTokensComponent,
    AnalyticsGlobalTokensMetricItemComponent,
    AnalyticsTabsComponent,
  ],
  providers: [AnalyticsDashboardService],
})
export class AnalyticsModule {}
