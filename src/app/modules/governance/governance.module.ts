import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivityModule } from '../newsfeed/activity/activity.module';
import { LegacyModule } from '../legacy/legacy.module';
import { LanguageModule } from '../language/language.module';
import { GovernanceComponent } from './governance.component';
import { GovernanceTabsComponent } from './tabs/tabs.component';
import { GovernanceLatestComponent } from './latest/latest.component';
import { GovernanceEnactedComponent } from './enacted/enacted.component';
import { GovernanceCardComponent } from './card/card.component';
import { GovernanceCreateComponent } from './create/create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '../../common/common.module';
import { ProposalListComponent } from './proposal-list/proposal-list.component';
import { SnapshotService } from './snapshot.service';
import { GovernanceService } from './governance.service';
import { GovernanceFilterSelector } from './filter-selector/filter-selector.component';
import { ModalsModule } from '../modals/modals.module';
import { EmbedServiceV2 } from '../../services/embedV2.service';
import { GovernanceProposalDetailComponent } from './proposal-detail/proposal-detail.component';
import { GroupsModule } from '../groups/groups.module';

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
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
          {
            path: 'proposal/:id',
            component: GovernanceProposalDetailComponent,
          },
        ],
      },
    ]),
    CommonModule,
    ActivityModule,
    ModalsModule,
    LegacyModule, // For subscribe button
    GroupsModule,
    LanguageModule,
  ],
  providers: [SnapshotService, GovernanceService, EmbedServiceV2],
  declarations: [
    GovernanceComponent,
    GovernanceTabsComponent,
    GovernanceLatestComponent,
    GovernanceEnactedComponent,
    GovernanceCardComponent,
    GovernanceCreateComponent,
    ProposalListComponent,
    GovernanceFilterSelector,
    GovernanceProposalDetailComponent,
  ],
  exports: [
    GovernanceComponent,
    GovernanceTabsComponent,
    GovernanceLatestComponent,
    GovernanceEnactedComponent,
    GovernanceCardComponent,
    GovernanceCreateComponent,
    GovernanceFilterSelector,
    GovernanceProposalDetailComponent,
  ],
})
export class GovernanceModule {}
