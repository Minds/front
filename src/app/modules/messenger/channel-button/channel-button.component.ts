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

@Component({
  selector: 'm-messenger--channel-button',
  templateUrl: 'channel-button.component.html',
  inputs: ['user'],
})
export class MessengerChannelButton {
  user: any;

  constructor(
    public session: Session,
    public client: Client,
    public dockpanes: MessengerConversationDockpanesService
  ) {}

  chat() {
    let conversation = this.buildConversation();
    this.dockpanes.open(conversation);
  }

  private buildConversation() {
    return {
      guid: this.permutate(),
      participants: [this.user],
      open: true,
    };
  }

  private permutate() {
    let participants = [this.user.guid, this.session.getLoggedInUser().guid];
    participants.sort((a, b) => (a < b ? -1 : 1));
    return participants.join(':');
  }
}
