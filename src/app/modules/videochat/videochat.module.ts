import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';

import { CommonModule } from '../../common/common.module';
import { VideoChatComponent } from './videochat.component';
import { VideoChatService } from './videochat.service';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    
  ],
  declarations: [
    VideoChatComponent,
  ],
  exports: [
    VideoChatComponent
  ],
  providers: [
    VideoChatService
  ]
})
export class VideoChatModule {
}
