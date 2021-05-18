import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { Client } from '../../services/api';
import { SocketsService } from '../../services/sockets';
import { Session } from '../../services/session';

import { CommonModule } from '../../common/common.module';

import { NotificationsFlyoutComponent } from './flyout.component';
import { NotificationsTopbarToggleComponent } from './toggle.component';
import { NotificationComponent } from './notification.component';
import { NotificationsComponent } from './notifications.component';

import { NotificationService } from './notification.service';
import { NotificationsToasterComponent } from './toaster.component';
import { SiteService } from '../../common/services/site.service';
import { MetaService } from '../../common/services/meta.service';
import { NotificationsV3ListComponent } from './v3/list.component';
import { NotificationsV3NotificationComponent } from './v3/notification.component';
import { NewsfeedModule } from '../newsfeed/newsfeed.module';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild([
      { path: 'notifications/v3', component: NotificationsV3ListComponent },
      { path: 'notifications/:filter', component: NotificationsComponent },
      { path: 'notifications', component: NotificationsComponent },
    ]),
    NewsfeedModule, // For m-newsfeed__entity
  ],
  declarations: [
    NotificationsFlyoutComponent,
    NotificationsComponent,
    NotificationComponent,
    NotificationsTopbarToggleComponent,
    NotificationsToasterComponent,
    // V3
    NotificationsV3ListComponent,
    NotificationsV3NotificationComponent,
  ],
  providers: [
    {
      provide: NotificationService,
      useFactory: NotificationService._,
      deps: [
        Session,
        Client,
        SocketsService,
        MetaService,
        PLATFORM_ID,
        SiteService,
      ],
    },
  ],
  exports: [
    NotificationsFlyoutComponent,
    NotificationsComponent,
    NotificationComponent,
    NotificationsTopbarToggleComponent,
    NotificationsToasterComponent,
  ],
})
export class NotificationModule {}
