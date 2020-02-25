import { NgModule } from '@angular/core';

import { AdminAnalyticsComponent } from './pages/admin/admin.component';
import { CommonModule } from '../../common/common.module';
import { CommonModule as NgCommonModule } from '@angular/common';
import { PostsChartComponent } from './components/charts/posts/posts.component';
import { AnalyticsComponent } from './page/analytics.component';
import { RouterModule, Routes } from '@angular/router';
import { ChannelAnalyticsComponent } from './pages/channel/channel.component';
import { ActiveUsersCardComponent } from './components/cards/active-users/active-users.component';
import { AnalyticsCardComponent } from './components/cards/card/card.component';
import { OffChainBoostsCardComponent } from './components/cards/offchain-boosts/boosts.component';
import { ActivityCardComponent } from './components/cards/activity/activity.component';
import { CommentsChartComponent } from './components/charts/comments/comments.component';
import { ChannelGeneralAnalyticsComponent } from './pages/channel/general/general.component';
import { ChannelReachAnalyticsComponent } from './pages/channel/reach/reach.component';
import { ChannelBoostsComponent } from './components/charts/boosts/channel-boosts.component';
import { OffChainBoostsChartComponent } from './components/charts/boosts/offchain-boosts.component';
import { ChannelInteractionsComponent } from './components/charts/interactions/interactions.component';
import { InteractionsCardComponent } from './components/cards/interactions/interactions.component';
import { ChannelBoostsCardComponent } from './components/cards/channel-boosts/channel-boosts.component';
import { SiteNetworkActivityAnalyticsComponent } from './pages/admin/network-activity/network-activity.component';
import { SiteTokenTransactionsAnalyticsComponent } from './pages/admin/token-transactions/token-transactions.component';
import { UserSegmentsCardComponent } from './components/cards/user-segments/segments.component';
import { UserSegmentsChartComponent } from './components/charts/user-segments/segments.component';
import { VotesChartComponent } from './components/charts/votes/votes.component';
import { RemindsChartComponent } from './components/charts/reminds/reminds.component';
import { EngagementCardComponent } from './components/cards/engagement/engagement.component';
import { OnChainBoostsChartComponent } from './components/charts/boosts/onchain-boosts.component';
import { OnChainBoostsCardComponent } from './components/cards/onchain-boosts/boosts.component';
import { OffchainPlusChartComponent } from './components/charts/plus/offchain-plus.component';
import { OnchainPlusChartComponent } from './components/charts/plus/onchain-plus.component';
import { OffChainPlusCardComponent } from './components/cards/offchain-plus/offchain-plus.component';
import { OnChainPlusCardComponent } from './components/cards/onchain-plus/onchain-plus.component';
import { OffchainWireChartComponent } from './components/charts/wire/offchain-wire.component';
import { OnchainWireChartComponent } from './components/charts/wire/onchain-wire.component';
import { OffchainWireCardComponent } from './components/cards/offchain-wire/wire.component';
import { OnchainWireCardComponent } from './components/cards/onchain-wire/wire.component';
import { WithdrawChartComponent } from './components/charts/withdraw/withdraw.component';
import { WithdrawCardComponent } from './components/cards/withdraw/withdraw.component';
import { TokenSalesChartComponent } from './components/charts/token-sales/sales.component';
import { TokenSalesCardComponent } from './components/cards/token-sales/sales.component';
import { RewardsChartComponent } from './components/charts/rewards/rewards.component';
import { RewardsCardComponent } from './components/cards/rewards/rewards.component';
import { ActiveUsersChartComponent } from './components/charts/active-users/active-users.component';
import { Graph } from './graph.component';
import { PageviewsCardComponent } from './components/cards/pageviews/pageviews.component';
import { PageviewsChartComponent } from './components/charts/pageviews/pageviews.component';
import { AnalyticsDashboardComponent } from './v2/dashboard.component';
import { AnalyticsLayoutChartComponent } from './v2/layouts/layout-chart/layout-chart.component';
import { AnalyticsLayoutSummaryComponent } from './v2/layouts/layout-summary/layout-summary.component';
import { AnalyticsMetricsComponent } from './v2/components/metrics/metrics.component';
import { AnalyticsFiltersComponent } from './v2/components/filters/filters.component';
import { AnalyticsChartComponent } from './v2/components/chart/chart.component';
import { AnalyticsTableComponent } from './v2/components/table/table.component';
import { AnalyticsDashboardService } from './v2/dashboard.service';
import { SearchModule } from '../search/search.module';
import { AnalyticsSearchComponent } from './v2/components/search/search.component';
import { FormsModule } from '@angular/forms';
import { AnalyticsSearchSuggestionsComponent } from './v2/components/search-suggestions/search-suggestions.component';
import { AnalyticsBenchmarkComponent } from './v2/components/benchmark/benchmark.component';

import * as PlotlyJS from 'plotly.js/dist/plotly-basic.min.js';
import { PlotlyModule } from 'angular-plotly.js';
import { ChartV2Component } from './components/chart-v2/chart-v2.component';
PlotlyModule.plotlyjs = PlotlyJS;

const routes: Routes = [
  {
    path: '',
    component: AnalyticsComponent,
    children: [
      { path: '', redirectTo: 'dashboard/traffic', pathMatch: 'full' },
      {
        path: 'dashboard',
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
    ],
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild(routes),
    PlotlyModule,
    SearchModule,
    FormsModule,
  ],
  exports: [
    AdminAnalyticsComponent,
    PostsChartComponent,
    ActiveUsersChartComponent,
    AnalyticsCardComponent,
  ],
  declarations: [
    AnalyticsCardComponent,
    ActivityCardComponent,
    PostsChartComponent,
    CommentsChartComponent,
    VotesChartComponent,
    RemindsChartComponent,
    ActiveUsersChartComponent,
    OffChainBoostsChartComponent,
    OnChainBoostsChartComponent,
    OffchainWireChartComponent,
    OnchainWireChartComponent,
    OffchainWireCardComponent,
    OnchainWireCardComponent,
    OffchainPlusChartComponent,
    OnchainPlusChartComponent,
    ChannelInteractionsComponent,
    WithdrawChartComponent,
    WithdrawCardComponent,
    RewardsChartComponent,
    RewardsCardComponent,
    TokenSalesChartComponent,
    TokenSalesCardComponent,
    OffChainPlusCardComponent,
    OnChainPlusCardComponent,
    ChannelBoostsComponent,
    InteractionsCardComponent,
    ChannelBoostsCardComponent,
    AdminAnalyticsComponent,
    ChannelAnalyticsComponent,
    AnalyticsComponent,
    ActiveUsersCardComponent,
    OffChainBoostsCardComponent,
    OnChainBoostsCardComponent,
    SiteNetworkActivityAnalyticsComponent,
    SiteTokenTransactionsAnalyticsComponent,
    ChannelGeneralAnalyticsComponent,
    ChannelReachAnalyticsComponent,
    UserSegmentsChartComponent,
    UserSegmentsCardComponent,
    EngagementCardComponent,
    PageviewsChartComponent,
    PageviewsCardComponent,
    Graph,
    AnalyticsDashboardComponent,
    AnalyticsLayoutChartComponent,
    AnalyticsLayoutSummaryComponent,
    AnalyticsMetricsComponent,
    AnalyticsFiltersComponent,
    AnalyticsChartComponent,
    AnalyticsTableComponent,
    AnalyticsSearchComponent,
    AnalyticsSearchSuggestionsComponent,
    AnalyticsBenchmarkComponent,
    ChartV2Component,
  ],
  providers: [AnalyticsDashboardService],
})
export class AnalyticsModule {}
