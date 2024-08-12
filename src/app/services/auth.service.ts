import { Injectable } from '@angular/core';
import { Client } from './api/client';
import { PushNotificationService } from '../common/services/push-notification.service';
import { Session } from './session';

@Injectable()
export class AuthService {
  constructor(
    protected readonly client: Client,
    protected readonly session: Session,
    protected readonly pushNotificationService: PushNotificationService
  ) {}

  async logout(closeAll: boolean = false): Promise<boolean> {
    let endpoint: string = 'api/v1/authenticate';

    if (closeAll) {
      endpoint += '/all';
    }

    try {
      await this.pushNotificationService.unregisterToken();
      await this.client.delete(endpoint);
    } catch (e) {
      console.error('[AuthService] failed to unregister token');
    }

    this.session.logout();

    return true;
  }
}
