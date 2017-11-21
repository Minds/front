import { Component, Injector } from '@angular/core';

import { MessengerEncryptionService } from '../encryption/encryption.service';
import { animations } from '../animations';
import { SessionFactory } from '../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'm-messenger--setup',
  templateUrl: 'setup.component.html',
  animations: animations,
  })

export class MessengerSetupChat {

  open: boolean = true;
  attentionNeededTrigger: any;
  encryption = this.injector.get(MessengerEncryptionService);

  constructor(private injector : Injector) {}


  toggle() {
    this.open = !this.open;
  }

  openPane() {
    this.open = true;
    this.attentionNeededTrigger = Date.now();
  }
}
