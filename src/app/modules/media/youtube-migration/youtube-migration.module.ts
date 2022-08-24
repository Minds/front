import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YoutubeMigrationComponent } from './youtube-migration.component';
import { YoutubeMigrationConnectComponent } from './connect/connect.component';
import { YoutubeMigrationConfigComponent } from './config/config.component';
import { YoutubeMigrationService } from './youtube-migration.service';
import { YoutubeMigrationMarketingComponent } from './marketing/marketing.component';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { MarketingModule } from '../../marketing/marketing.module';

@NgModule({
  declarations: [
    YoutubeMigrationComponent,
    YoutubeMigrationConnectComponent,
    YoutubeMigrationConfigComponent,
    YoutubeMigrationMarketingComponent,
  ],
  imports: [
    CommonModule,
    NgCommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MarketingModule,
  ],
  exports: [
    YoutubeMigrationComponent,
    YoutubeMigrationConnectComponent,
    YoutubeMigrationConfigComponent,
  ],
  providers: [
    {
      provide: YoutubeMigrationService,
      useFactory: (client, session) =>
        new YoutubeMigrationService(client, session),
      deps: [Client, Session],
    },
  ],
})
export class YoutubeMigrationModule {}
