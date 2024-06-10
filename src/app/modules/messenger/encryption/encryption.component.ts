import { Component, EventEmitter, OnInit } from '@angular/core';

import { Client } from '../../../services/api';
import { Session } from '../../../services/session';

import { MessengerEncryptionService } from './encryption.service';
import { ToasterService } from '../../../common/services/toaster.service';

/**
 * DEPRECATED
 * Messenger was replaced with Minds Chat
 */
@Component({
  selector: 'm-messenger--encryption',
  host: {
    class: 'm-messenger--encryption',
  },
  outputs: ['on'],
  templateUrl: 'encryption.component.html',
})
export class MessengerEncryption implements OnInit {
  minds: Minds;
  on: EventEmitter<any> = new EventEmitter(true);
  inProgress: boolean = false;
  username: string = '';

  constructor(
    public session: Session,
    public client: Client,
    public encryption: MessengerEncryptionService,
    protected toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.username = `@${this.session.getLoggedInUser().username}` || 'user';
  }

  unlock(password) {
    this.inProgress = true;
    this.encryption
      .unlock(password.value)
      .then(() => {
        password.value = '';
        this.on.next(true);
        this.inProgress = false;
      })
      .catch(() => {
        this.toasterService.error('Wrong password. Please try again.');
        this.inProgress = false;
      });
  }

  setup(password, password2) {
    if (password.value !== password2.value) {
      this.toasterService.error('Your passwords must match');
      return;
    }
    this.inProgress = true;
    this.encryption
      .doSetup(password.value)
      .then(() => {
        password.value = '';
        password2.value = '';
        this.toasterService.success('Successfully setup messenger password.');
        this.on.next(true);
        this.inProgress = false;
      })
      .catch(() => {
        this.toasterService.error('Sorry, there was a problem.');
        this.inProgress = false;
      });
  }

  rekey(password, password2) {
    if (password.value !== password2.value) {
      this.toasterService.error('Your passwords must match');
      return;
    }
    this.inProgress = true;
    this.encryption
      .rekey(password.value)
      .then(() => {
        password.value = '';
        password2.value = '';
        this.encryption.reKeying = false;
        this.toasterService.success('Successfully changed messenger password.');
        this.on.next(true);
        this.inProgress = false;
      })
      .catch(() => {
        this.toasterService.error('Sorry, there was a problem.');
        this.inProgress = false;
      });
  }
}
