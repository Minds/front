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
import { SearchModule } from '../search/search.module';
import { AnalyticsSearchComponent } from './v2/components/search/search.component';
import { FormsModule } from '@angular/forms';
import { AnalyticsSearchSuggestionsComponent } from './v2/components/search-suggestions/search-suggestions.component';
import { AnalyticsBenchmarkComponent } from './v2/components/benchmark/benchmark.component';
import { ChartV2Module } from './components/chart-v2/chart-v2.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/traffic',
    pathMatch: 'full',
  },
  {
    path: 'dashboard/:category',
    component: AnalyticsDashboardComponent,
    data: {
      title: 'Analytics',
      description:
        'Track your traffic, earnings, engagement and trending analytics',
      ogImage: '/assets/photos/network.jpg',
    },
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild(routes),
    ChartV2Module,
    SearchModule,
    FormsModule,
  ],
  declarations: [
    AnalyticsDashboardComponent,
    AnalyticsLayoutChartComponent,
    AnalyticsLayoutSummaryComponent,
    AnalyticsFiltersComponent,
    AnalyticsChartComponent,
    AnalyticsTableComponent,
    AnalyticsSearchComponent,
    AnalyticsSearchSuggestionsComponent,
    AnalyticsBenchmarkComponent,
  ],
  providers: [AnalyticsDashboardService],
})
export class AnalyticsModule {}
