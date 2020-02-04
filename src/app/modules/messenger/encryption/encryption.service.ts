import { Client } from '../../../services/api';
import { Storage } from '../../../services/storage';
import { Injectable } from '@angular/core';
import { Session } from '../../../services/session';

@Injectable()
export class MessengerEncryptionService {
  public reKeying: boolean = false;

  private on: boolean = false;
  private setup: boolean = false;

  constructor(
    public client: Client,
    public storage: Storage,
    private session: Session
  ) {}

  isOn(): boolean {
    //if(!this.on){
    this.on = !!this.storage.get('encryption-unlocked');
    //}
    return this.on;
  }

  unlock(password: string) {
    return new Promise((resolve, reject) => {
      this.client
        .post('api/v2/messenger/keys/unlock', { password: password })
        .then((response: any) => {
          this.storage.set('encryption-unlocked', true);
          this.on = true;
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }

  isSetup(): boolean {
    //TODO: this won't work on nativescript, so move away from window var.
    //if(!this.setup){
    this.setup = this.session.getLoggedInUser().chat;
    //}
    return this.setup;
  }

  doSetup(password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client
        .post('api/v2/messenger/keys/setup', {
          password: password,
          download: false,
        })
        .then((response: any) => {
          this.storage.set('encryption-unlocked', true);
          this.setup = true;
          this.on = true;
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }

  rekey(password: string) {
    return new Promise((resolve, reject) => {
      this.client
        .post('api/v2/messenger/keys/setup', {
          password: password,
          download: false,
        })
        .then((response: any) => {
          this.storage.set('encryption-unlocked', true);
          this.setup = true;
          this.on = true;
          this.reKeying = false;
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }

  logout() {
    this.storage.destroy('encryption-unlocked');
    this.on = false;
  }
}
