import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '../../services/storage';

@Injectable({
  providedIn: 'root',
})
export class MessengerService {
  showLegacyMessenger$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(protected storage: Storage) {}

  /**
   * Determine visibility with local stoarage
   */
  public setupLegacyMessengerVisibility(): void {
    const storage = this.storage.get('legacy_messenger');

    const show = storage === null ? false : JSON.parse(storage);

    this.showLegacyMessenger$.next(show);
  }
}
