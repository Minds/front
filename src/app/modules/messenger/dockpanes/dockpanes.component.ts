import { Component, ElementRef, Injector } from '@angular/core';

import { SocketsService } from '../../../services/sockets';
import { Client } from '../../../services/api';
import { Storage } from '../../../services/storage';

import { MessengerConversationDockpanesService } from './dockpanes.service';

/**
 * DEPRECATED
 * Messenger was replaced with Minds Chat
 */
@Component({
  moduleId: module.id,
  selector: 'm-messenger--conversation-dockpanes',
  templateUrl: 'dockpanes.component.html',
})
export class MessengerConversationDockpanes {
  conversations: Array<any> = this.dockpanes.conversations;

  constructor(public dockpanes: MessengerConversationDockpanesService) {}
}

export { MessengerConversationDockpanesService } from './dockpanes.service';
