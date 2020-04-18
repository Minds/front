import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YoutubeMigrationComponent } from './youtube-migration.component';
import { YoutubeMigrationConnectComponent } from './connect/connect.component';
import { YoutubeMigrationDashboardComponent } from './dashboard/dashboard.component';
import { YoutubeMigrationListComponent } from './list/list.component';
import { YoutubeMigrationConfigComponent } from './config/config.component';
import { YoutubeMigrationTransferStatusComponent } from './transfer-status/transfer-status.component';
import { YoutubeMigrationService } from './youtube-migration.service';
import { YoutubeMigrationUnmigratedVideosComponent } from './unmigrated-videos/unmigrated-videos.component';
import { YoutubeMigrationMigratedVideosComponent } from './migrated-videos/migrated-videos.component';

const routes: Routes = [
  {
    path: '',
    component: YoutubeMigrationComponent,
    children: [
      { path: '', redirectTo: 'connect', pathMatch: 'full' },
      { path: 'connect', component: YoutubeMigrationConnectComponent },
      {
        path: 'dashboard',
        component: YoutubeMigrationDashboardComponent,
        children: [
          { path: '', redirectTo: 'available', pathMatch: 'full' },
          {
            path: 'available',
            component: YoutubeMigrationUnmigratedVideosComponent,
          },
          {
            path: 'transferred',
            component: YoutubeMigrationMigratedVideosComponent,
          },
          { path: 'config', component: YoutubeMigrationConfigComponent },
        ],
      },
    ],
  },
];
@NgModule({
  declarations: [
    YoutubeMigrationComponent,
    YoutubeMigrationConnectComponent,
    YoutubeMigrationDashboardComponent,
    YoutubeMigrationListComponent,
    YoutubeMigrationConfigComponent,
    YoutubeMigrationTransferStatusComponent,
    YoutubeMigrationUnmigratedVideosComponent,
    YoutubeMigrationMigratedVideosComponent,
  ],
  imports: [
    CommonModule,
    NgCommonModule,
    RouterModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [YoutubeMigrationComponent],
  entryComponents: [YoutubeMigrationComponent],
  providers: [YoutubeMigrationService],
})
export class YoutubeMigrationModule {}
