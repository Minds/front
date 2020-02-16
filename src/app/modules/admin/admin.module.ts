import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';

import { AdminReportsDownload } from './reports-download/reports-download';
import { AdminBoosts } from './boosts/boosts';
import { AdminFirehoseComponent } from './firehose/firehose.component';
import { AdminPages } from './pages/pages';
import { AdminReports } from './reports/reports';
import { AdminMonetization } from './monetization/monetization';
import { AdminPrograms } from './programs/programs.component';
import { AdminPayouts } from './payouts/payouts.component';
import { AdminFeatured } from './featured/featured';
import { AdminTagcloud } from './tagcloud/tagcloud.component';
import { AdminVerify } from './verify/verify.component';
import { RejectionReasonModalComponent } from './boosts/modal/rejection-reason-modal.component';
import { AdminInteractions } from './interactions/interactions.component';
import { InteractionsTableComponent } from './interactions/table/table.component';
import { AdminPurchasesComponent } from './purchases/purchases.component';
import { AdminWithdrawals } from './withdrawals/withdrawals.component';
import { AdminFeaturesComponent } from './features/admin-features.component';
import { CommonModule } from '../../common/common.module';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { LegacyModule } from '../legacy/legacy.module';
import { BlogModule } from '../blogs/blog.module';
import { GroupsModule } from '../groups/groups.module';
import { FormsModule } from '@angular/forms';
import { CommentsModule } from '../comments/comments.module';

const routes: Routes = [
  {
    path: ':filter/:type',
    component: AdminComponent,
    data: { title: 'Admin' },
  },
  { path: ':filter', component: AdminComponent, data: { title: 'Admin' } },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    LegacyModule,
    BlogModule,
    GroupsModule,
    CommentsModule,
  ],
  declarations: [
    AdminComponent,
    InteractionsTableComponent,
    AdminInteractions,
    RejectionReasonModalComponent,
    AdminBoosts,
    AdminFirehoseComponent,
    AdminPages,
    AdminReports,
    AdminMonetization,
    AdminPrograms,
    AdminPayouts,
    AdminFeatured,
    AdminTagcloud,
    AdminVerify,
    AdminPurchasesComponent,
    AdminWithdrawals,
    AdminReportsDownload,
    AdminFeaturesComponent,
  ],
})
export class AdminModule {}
