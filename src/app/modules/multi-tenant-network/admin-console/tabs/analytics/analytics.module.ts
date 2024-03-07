import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../../../common/common.module';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NetworkAdminConsoleSharedModule } from '../../network-admin-console-shared.module';
import { NetworkAdminAnalyticsBaseComponent } from './components/base/base.component';
import { NetworkAdminAnalyticsKpisComponent } from './components/kpis/kpis.component';
import { NetworkAdminAnalyticsUpdateTimestampComponent } from './components/update-timestamp/update-timestamp.component';
import { ChartV2Module } from '../../../../analytics/components/chart-v2/chart-v2.module';
import { NetworkAdminAnalyticsKpiCardComponent } from './components/kpis/kpi-card/kpi-card.component';
import { MetricNameParserPipe } from './pipes/metric-name-parser.pipe';
import { MetricValueParserPipe } from './pipes/metric-value-parser.pipe';
import { NetworkAdminAnalyticsTabsComponent } from './components/tabs/tabs.component';
import { NetworkAdminAnalyticsTableComponent } from './components/table/table.component';
import { PathMatch } from '../../../../../common/types/angular.types';
import { NoRouteReuseStrategy } from '../../../../../common/routerReuseStrategies/no-route-reuse.strategy';
import { NetworkAdminAnalyticsEmptyStateCardComponent } from './components/empty-state-card/empty-state-card/empty-state-card.component';
import { NetworkAdminAnalyticsEmptyStateCardWrapperComponent } from './components/empty-state-card/empty-state-card-wrapper/empty-state-card-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: NetworkAdminAnalyticsBaseComponent,
    children: [
      {
        path: '',
        redirectTo: 'posts',
        pathMatch: 'full' as PathMatch,
        data: { type: 'posts' },
      },
      {
        path: ':typeParam',
        component: NetworkAdminAnalyticsTableComponent,
        data: { reloadOnRouteChange: true },
      },
    ],
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NetworkAdminConsoleSharedModule,
    ChartV2Module,
    MetricNameParserPipe,
    MetricValueParserPipe,
    RouterModule.forChild(routes),
  ],
  declarations: [
    NetworkAdminAnalyticsBaseComponent,
    NetworkAdminAnalyticsTabsComponent,
    NetworkAdminAnalyticsKpisComponent,
    NetworkAdminAnalyticsKpiCardComponent,
    NetworkAdminAnalyticsUpdateTimestampComponent,
    NetworkAdminAnalyticsTableComponent,
    NetworkAdminAnalyticsEmptyStateCardComponent,
    NetworkAdminAnalyticsEmptyStateCardWrapperComponent,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: NoRouteReuseStrategy }],
})
export class NetworkAdminAnalyticsModule {}
