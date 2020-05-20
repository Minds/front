import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DiscoveryComponent } from './discovery.component';
import { SuggestionsModule } from '../suggestions/suggestions.module';
import { CommonModule } from '../../common/common.module';
import { DiscoveryTrendsComponent } from './trends/trends.component';
import { DiscoveryTrendsListItemComponent } from './trends/list-item.component';
import { DiscoveryTrendComponent } from './trends/trend/trend.component';
import { ActivityModule } from '../newsfeed/activity/activity.module';
import { DiscoverySearchComponent } from './search/search.component';
import { DiscoveryTagsComponent } from './tags/tags.component';
import { DiscoveryTrendsService } from './trends/trends.service';
import { LegacyModule } from '../legacy/legacy.module';
import { DiscoverySharedModule } from './discovery-shared.module';
import { DiscoveryFeedsComponent } from './feeds/feeds.component';
import { DiscoverySettingsButtonComponent } from './settings-button/settings-button.component';
import { DiscoveryDisclaimerComponent } from './disclaimer/disclaimer.component';
import { DiscoverySuggestionsComponent } from './suggestions/suggestions.component';
import { DiscoveryNoTagsPromptComponent } from './tags/notags-prompt/notags-prompt.component';
import { DiscoveryFeedsListComponent } from './feeds/feeds-list.component';
import { HashtagsModule } from '../hashtags/hashtags.module';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DiscoveryComponent,
        children: [
          { path: '', redirectTo: 'overview' },
          {
            path: 'overview',
            component: DiscoveryTrendsComponent,
          },
          {
            path: 'trend/:guid',
            component: DiscoveryTrendComponent,
          },
          {
            path: 'search',
            component: DiscoverySearchComponent,
          },
          {
            path: 'tags',
            component: DiscoveryTagsComponent,
          },
          {
            path: 'feeds',
            children: [
              { path: '', redirectTo: 'preferred' },
              {
                path: 'preferred',
                component: DiscoveryFeedsComponent,
              },
              {
                path: 'trending',
                component: DiscoveryFeedsComponent,
              },
            ],
          },
          {
            path: 'suggestions',
            children: [
              { path: '', redirectTo: 'user' },
              {
                path: 'user',
                component: DiscoverySuggestionsComponent,
              },
              {
                path: 'group',
                component: DiscoverySuggestionsComponent,
              },
            ],
          },
        ],
      },
    ]),
    NgCommonModule,
    CommonModule,
    SuggestionsModule,
    ActivityModule,
    LegacyModule, // For subscribe button
    // GroupsModule,
    DiscoverySharedModule,
    HashtagsModule,
  ],
  providers: [DiscoveryTrendsService],
  declarations: [
    DiscoveryComponent,
    DiscoveryTrendsComponent,
    DiscoveryTrendsListItemComponent,
    DiscoveryTrendComponent,
    DiscoverySearchComponent,
    DiscoveryTagsComponent,
    DiscoveryFeedsComponent,
    DiscoveryFeedsListComponent,
    DiscoverySettingsButtonComponent,
    DiscoveryDisclaimerComponent,
    DiscoverySuggestionsComponent,
    DiscoveryNoTagsPromptComponent,
  ],
  exports: [DiscoveryComponent],
})
export class DiscoveryModule {}
