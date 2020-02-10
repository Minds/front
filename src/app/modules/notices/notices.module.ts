import { NgModule, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LegacyModule } from '../legacy/legacy.module';

import { CommonModule } from '../../common/common.module';
import { NoticesSidebarComponent } from './sidebar.component';
import { NoticesService } from './notices.service';

@NgModule({
  imports: [
    CommonModule,
    NgCommonModule,
    RouterModule,
    LegacyModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [NoticesSidebarComponent],
  exports: [NoticesSidebarComponent],
  providers: [
    {
      provide: NoticesService,
      useFactory: (_http, platformId) => {
        return new NoticesService(_http, platformId);
      },
      deps: [HttpClient, PLATFORM_ID],
    },
  ],
})
export class NoticesModule {}
