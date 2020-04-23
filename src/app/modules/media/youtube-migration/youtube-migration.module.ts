import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YoutubeMigrationComponent } from './youtube-migration.component';
import { YoutubeMigrationConnectComponent } from './connect/connect.component';
import { YoutubeMigrationDashboardComponent } from './dashboard/dashboard.component';
import { YoutubeMigrationConfigComponent } from './config/config.component';
import { YoutubeMigrationTransferStatusComponent } from './transfer-status/transfer-status.component';
import { YoutubeMigrationService } from './youtube-migration.service';
import { YoutubeMigrationUnmigratedVideosComponent } from './unmigrated-videos/unmigrated-videos.component';
import { YoutubeMigrationMigratedVideosComponent } from './migrated-videos/migrated-videos.component';

@NgModule({
  declarations: [
    YoutubeMigrationComponent,
    YoutubeMigrationConnectComponent,
    YoutubeMigrationDashboardComponent,
    YoutubeMigrationConfigComponent,
    YoutubeMigrationTransferStatusComponent,
    YoutubeMigrationUnmigratedVideosComponent,
    YoutubeMigrationMigratedVideosComponent,
  ],
  imports: [
    CommonModule,
    NgCommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    YoutubeMigrationComponent,
    YoutubeMigrationConnectComponent,
    YoutubeMigrationDashboardComponent,
    YoutubeMigrationMigratedVideosComponent,
    YoutubeMigrationUnmigratedVideosComponent,
    YoutubeMigrationConfigComponent,
  ],
  entryComponents: [YoutubeMigrationComponent],
  providers: [YoutubeMigrationService],
})
export class YoutubeMigrationModule {}
