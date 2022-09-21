import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';

import { AdminBoosts } from './boosts/boosts';
import { AdminFirehoseComponent } from './firehose/firehose.component';
import { AdminReports } from './reports/reports';
import { AdminTagcloud } from './tagcloud/tagcloud.component';
import { AdminVerify } from './verify/verify.component';
import { RejectionReasonModalComponent } from './boosts/modal/rejection-reason-modal.component';
import { AdminInteractions } from './interactions/interactions.component';
import { InteractionsTableComponent } from './interactions/table/table.component';
import { AdminWithdrawals } from './withdrawals/withdrawals.component';
import { AdminFeaturesComponent } from './features/admin-features.component';
import { CommonModule } from '../../common/common.module';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { GroupsModule } from '../groups/groups.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentsModule } from '../comments/comments.module';
import { ActivityModule } from '../newsfeed/activity/activity.module';
import { ActivityV2Module } from '../newsfeed/activity-v2/activity.module';
import { AdminLiquidityProvidersComponent } from './liquidity-providers/liquidity-providers.component';
import { AdminTransactionExplorersComponent } from './withdrawals/transaction-explorers/transaction-explorers.component';
import { AdminPushNotificationsFormComponent } from './push-notifications/form/admin-push-notifications-form.component';
import { AdminPushNotificationsHistoryComponent } from './push-notifications/history/admin-push-notifications-history.component';
import { NotificationHistoryCardComponent } from './push-notifications/history/card/notification-history-card.component';
import { AdminPushNotificationsComponent } from './push-notifications/admin-push-notifications.component';

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
    GroupsModule,
    CommentsModule,
    ReactiveFormsModule,
    ActivityModule, // delete during ActivityV2 cleanup
    ActivityV2Module,
  ],
  declarations: [
    AdminComponent,
    InteractionsTableComponent,
    AdminInteractions,
    RejectionReasonModalComponent,
    AdminBoosts,
    AdminFirehoseComponent,
    AdminReports,
    AdminTagcloud,
    AdminVerify,
    AdminWithdrawals,
    AdminTransactionExplorersComponent,
    AdminFeaturesComponent,
    AdminLiquidityProvidersComponent,
    AdminPushNotificationsComponent,
    AdminPushNotificationsFormComponent,
    AdminPushNotificationsHistoryComponent,
    NotificationHistoryCardComponent,
  ],
})
export class AdminModule {}
