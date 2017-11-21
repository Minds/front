import { Component, ElementRef, Injector } from '@angular/core';

import { SocketsService } from '../../../services/sockets';
import { Client } from '../../../services/api';
import { Storage } from '../../../services/storage';

import { MessengerConversationDockpanesService } from './dockpanes.service';

@Component({
  moduleId: module.id,
  selector: 'm-messenger--conversation-dockpanes',
  templateUrl: 'dockpanes.component.html'
})

export class MessengerConversationDockpanes {

  dockpanes = this.injector.get(MessengerConversationDockpanesService);
  conversations: Array<any> = this.dockpanes.conversations;

  constructor(private injector: Injector) {

  }

}

export { MessengerConversationDockpanesService } from './dockpanes.service';
