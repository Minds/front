import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChatActionCardComponent } from '../../../action-cards/action-card.component';

/**
 * Info section for chat requests page.
 */
@Component({
  selector: 'm-chatRequestsInfoSubPage',
  styleUrls: ['./chat-requests-info.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChatActionCardComponent],
  standalone: true,
  template: `
    <div class="m-chatRequestInfo__container">
      <h2 class="m-chatRequestInfo__title">Chat requests</h2>
      <p class="m-chatRequestInfo__description">
        Requests from individuals you don't follow. You will need to reply to
        them to start the chat.
      </p>
    </div>
  `,
})
export class ChatRequestsInfoSubPageComponent {}
