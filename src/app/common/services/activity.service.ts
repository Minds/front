import { EventEmitter, Injectable } from '@angular/core';
import { Client } from '../../services/api/client';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ActivityService {
  public allowComment$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  constructor(private client: Client) {}

  public async toggleAllowComments(entity: any, areAllowed: boolean) {
    const payload = {
      allowed: areAllowed,
    };
    const oldValue = entity['allow_comments'];
    try {
      await this.client.post(
        `api/v2/permissions/comments/${entity.guid}`,
        payload
      );
      this.allowComment$.next(areAllowed);
      return areAllowed;
    } catch (ex) {
      console.error('Error posting activity comment permissions', ex);
      return oldValue;
    }
  }
}
