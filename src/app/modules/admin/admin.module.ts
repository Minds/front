import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { AdminFirehoseComponent } from './firehose/firehose.component';
import { AdminReports } from './reports/reports';
import { AdminTagcloud } from './tagcloud/tagcloud.component';
import { AdminVerify } from './verify/verify.component';
import { AdminInteractions } from './interactions/interactions.component';
import { InteractionsTableComponent } from './interactions/table/table.component';
import { AdminWithdrawals } from './withdrawals/withdrawals.component';
import { CommonModule } from '../../common/common.module';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { GroupsModule } from '../groups/groups.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentsModule } from '../comments/comments.module';
import { ActivityModule } from '../newsfeed/activity/activity.module';
import { AdminLiquidityProvidersComponent } from './liquidity-providers/liquidity-providers.component';
import { AdminTransactionExplorersComponent } from './withdrawals/transaction-explorers/transaction-explorers.component';
import { AdminPushNotificationsFormComponent } from './push-notifications/form/admin-push-notifications-form.component';
import { AdminPushNotificationsHistoryComponent } from './push-notifications/history/admin-push-notifications-history.component';
import { NotificationHistoryCardComponent } from './push-notifications/history/card/notification-history-card.component';
import { AdminPushNotificationsComponent } from './push-notifications/admin-push-notifications.component';
import { BoostModule } from '../boost/boost.module';
import { AdminAccountsComponent } from './accounts/admin-accounts.component';
import { AdminAccountsFormComponent } from './accounts/form/admin-accounts-form.component';
import { NetworkAdminExcludedHashtagsSharedModule } from '../multi-tenant-network/admin-console/tabs/moderation/excluded-hashtags/excluded-hashtags-shared.module';

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
    ActivityModule,
    BoostModule,
    NetworkAdminExcludedHashtagsSharedModule,
  ],
  declarations: [
    AdminComponent,
    InteractionsTableComponent,
    AdminInteractions,
    AdminFirehoseComponent,
    AdminReports,
    AdminTagcloud,
    AdminVerify,
    AdminWithdrawals,
    AdminTransactionExplorersComponent,
    AdminLiquidityProvidersComponent,
    AdminAccountsComponent,
    AdminAccountsFormComponent,
    AdminPushNotificationsComponent,
    AdminPushNotificationsFormComponent,
    AdminPushNotificationsHistoryComponent,
    NotificationHistoryCardComponent,
  ],
})
export class AdminModule {}
