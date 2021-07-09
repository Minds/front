import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { ChatSidebarPrompt } from './chat-sidebar-prompt/chat-sidebar-prompt.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [NgCommonModule, CommonModule, RouterModule],
  declarations: [ChatSidebarPrompt],
  exports: [ChatSidebarPrompt],
  // providers: [],
})
export class MessengerV2Module {}
