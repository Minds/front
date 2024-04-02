import { NgModule } from '@angular/core';
import { StartChatModalServiceComponent } from './start-chat-modal.component';

@NgModule({
  imports: [StartChatModalServiceComponent],
})
export class StartChatModalModule {
  public resolveComponent(): typeof StartChatModalServiceComponent {
    return StartChatModalServiceComponent;
  }
}
