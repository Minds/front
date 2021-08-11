import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SuggestionsModule } from '../suggestions/suggestions.module';
import { CommonModule } from '../../common/common.module';
import { ActivityModule } from '../newsfeed/activity/activity.module';
import { LegacyModule } from '../legacy/legacy.module';
import { LanguageModule } from '../language/language.module';
import { GovernanceComponent } from './governance.component';
import { GovernanceTabsComponent } from './tabs/tabs.component';
import { GovernanceLatestComponent } from './latest/latest.component';
import { GovernanceEnactedComponent } from './enacted/enacted.component';
import { GovernanceLatestService } from './latest/latest.service';
import { GovernanceCardComponent } from './card/card.component';
import { GovernanceCreateComponent } from './create/create.component';
import { ProposalListComponent } from './proposal-list/proposal-list.component';
import { SnapshotService } from './snapshot.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: GovernanceComponent,
        children: [
          { path: '', redirectTo: 'latest' },
          {
            path: 'latest',
            component: GovernanceLatestComponent,
          },
          {
            path: 'enacted',
            component: GovernanceEnactedComponent,
          },
          {
            path: 'create',
            component: GovernanceCreateComponent,
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
    LanguageModule,
    RouterModule,
  ],
  providers: [SnapshotService, GovernanceLatestService],
  declarations: [
    GovernanceComponent,
    GovernanceTabsComponent,
    GovernanceLatestComponent,
    GovernanceEnactedComponent,
    GovernanceCardComponent,
    ProposalListComponent,
  ],
  exports: [
    GovernanceComponent,
    GovernanceTabsComponent,
    GovernanceLatestComponent,
    GovernanceEnactedComponent,
    GovernanceCardComponent,
  ],
})
export class GovernanceModule {}
