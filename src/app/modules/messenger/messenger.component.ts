import { Component, Injector, ViewChild } from '@angular/core';

import { SocketsService } from '../../services/sockets';
import { Storage } from '../../services/storage';
import { Client } from '../../services/api';
import { Session } from '../../services/session';

import { MessengerConversationDockpanesService } from './dockpanes/dockpanes.component';
import { MessengerEncryptionService } from './encryption/encryption.service';
import { MessengerSounds } from './sounds/service';

import { MessengerUserlist } from './userlist/userlist.component';
import { MessengerSetupChat } from './setup/setup.component';

@Component({
  selector: 'm-messenger',
  templateUrl: 'messenger.component.html',
})
export class Messenger {
  @ViewChild('userList', { static: true }) userList: MessengerUserlist;
  @ViewChild('setupChat', { static: false }) setupChat: MessengerSetupChat;

  constructor(
    public session: Session,
    public client: Client,
    public sockets: SocketsService
  ) {}

  ngAfterViewInit() {
    // @todo: get rid of this ugly global window hack
    (<any>window).openMessengerWindow = () => {
      this.open();
    };
  }

  ngOnDestroy() {
    (<any>window).openMessengerWindow = function() {
      return;
    };
  }

  open(guid: any = null /* for future use */) {
    if (this.userList) {
      this.userList.openPane();
    } else if (this.setupChat) {
      this.setupChat.openPane();
    }
  }
}
export { MessengerConversation } from './conversation/conversation.component';
