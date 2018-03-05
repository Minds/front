import { Component, ElementRef, EventEmitter, Injector, Input, OnInit } from '@angular/core';

import { SocketsService } from '../../../services/sockets';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { Storage } from '../../../services/storage';

import { MessengerEncryptionService } from './encryption.service';

@Component({
  moduleId: module.id,
  selector: 'm-messenger--encryption',
  host: {
    'class': 'm-messenger--encryption'
  },
  outputs: ['on'],
  templateUrl: 'encryption.component.html'
})

export class MessengerEncryption implements OnInit {

  minds: Minds;
  on: EventEmitter<any> = new EventEmitter(true);

  inProgress: boolean = false;
  error: string = '';

  username: string = '';

  constructor(
    public session: Session,
    public client: Client,
    public encryption: MessengerEncryptionService,
  ) {
  }

  ngOnInit() {
    this.username = `@${this.session.getLoggedInUser().username}` || 'user';
  }

  unlock(password) {
    this.inProgress = true;
    this.error = '';
    this.encryption.unlock(password.value)
      .then(() => {
        password.value = '';        
        this.on.next(true);
        this.inProgress = false;
      })
      .catch(() => {
        this.error = 'Wrong password. Please try again.';
        this.inProgress = false;
      });
  }

  setup(password, password2) {
    if (password.value !== password2.value) {
      this.error = 'Your passwords must match';
      return;
    }
    this.inProgress = true;
    this.error = '';
    this.encryption.doSetup(password.value)
      .then(() => {
        password.value = '';
        password2.value = '';
        this.on.next(true);
        this.inProgress = false;
      })
      .catch(() => {
        this.error = 'Sorry, there was a problem.';
        this.inProgress = false;
      });
  }

  rekey(password, password2) {
    if (password.value !== password2.value) {
      this.error = 'Your passwords must match';
      return;
    }
    this.error = '';
    this.inProgress = true;
    this.encryption.rekey(password.value)
      .then(() => {
        password.value = '';
        password2.value = '';
        this.on.next(true);
        this.inProgress = false;
      })
      .catch(() => {
        this.error = 'Sorry, there was a problem';
        this.inProgress = false;
      });
  }

}
