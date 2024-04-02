import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../../../../common/common.module';
import { NetworkAdminConsoleReportsListComponent } from './reports-list.component';
import { NetworkAdminConsoleReportComponent } from './report/report.component';
import { CommentsModule } from '../../../../../comments/comments.module';
import { ActivityModule } from '../../../../../newsfeed/activity/activity.module';
import { RouterModule, Routes } from '@angular/router';
import { ChatRoomMessageComponent } from '../../../../../chat/components/chat-room/chat-room-messages/chat-room-message/chat-room-message.component';

const routes: Routes = [
  { path: '', component: NetworkAdminConsoleReportsListComponent },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    ActivityModule,
    CommentsModule,
    RouterModule.forChild(routes),
    ChatRoomMessageComponent,
  ],
  declarations: [
    NetworkAdminConsoleReportsListComponent,
    NetworkAdminConsoleReportComponent,
  ],
})
export class NetworkAdminReportLazyModule {}
