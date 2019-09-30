import { Injectable } from '@angular/core';
import { Client } from './api/client';
import { Session } from './session';

@Injectable()
export class AuthService {
  constructor(
    protected readonly client: Client,
    protected readonly session: Session
  ) {}

  logout(closeAll: boolean = false): boolean {
    let endpoint: string = 'api/v1/authenticate';

    if (closeAll) {
      endpoint += '/all';
    }

    this.client.delete(endpoint);
    this.session.logout();

    return true;
  }
}
