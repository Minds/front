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

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild([
      { path: 'notifications/:filter', component: NotificationsComponent },
      { path: 'notifications', component: NotificationsComponent },
    ]),
  ],
  declarations: [
    NotificationsFlyoutComponent,
    NotificationsComponent,
    NotificationComponent,
    NotificationsTopbarToggleComponent,
    NotificationsToasterComponent,
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
