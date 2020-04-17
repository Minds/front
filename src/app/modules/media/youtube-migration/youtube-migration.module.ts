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

@NgModule({
  declarations: [
    YoutubeMigrationComponent,
    YoutubeMigrationConnectComponent,
    YoutubeMigrationDashboardComponent,
    YoutubeMigrationListComponent,
    YoutubeMigrationConfigComponent,
    YoutubeMigrationTransferStatusComponent,
  ],
  imports: [
    CommonModule,
    NgCommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [YoutubeMigrationComponent, YoutubeMigrationConnectComponent],
  entryComponents: [YoutubeMigrationComponent],
  providers: [YoutubeMigrationService],
})
export class YoutubeMigrationModule {}
