import {
  Component,
  ElementRef,
  ChangeDetectorRef,
  EventEmitter,
  Injector,
} from '@angular/core';

import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { Storage } from '../../../services/storage';
import { MessengerConversationDockpanesService } from '../dockpanes/dockpanes.service';
import { MessengerConversationBuilderService } from '../dockpanes/conversation-builder.service';
import { MindsUser } from '../../../interfaces/entities';

/**
 * DEPRECATED
 * Messenger was replaced with Minds Chat
 */
@Component({
  selector: 'm-messenger--channel-button',
  templateUrl: 'channel-button.component.html',
  inputs: ['user'],
})
export class MessengerChannelButton {
  user: MindsUser;

  constructor(
    public session: Session,
    public client: Client,
    public dockpanes: MessengerConversationDockpanesService,
    public conversationBuilder: MessengerConversationBuilderService
  ) {}

  chat() {
    this.dockpanes.open(this.conversationBuilder.buildConversation(this.user));
  }
}
