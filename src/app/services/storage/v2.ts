import { MindsUser } from './../../interfaces/entities';
import { Session } from './../session';
import { Injectable } from '@angular/core';
import { UserStorageService } from './user/user-storage.service';
import { SessionStorageService } from './session/session-storage.service';
import { MemoryStorageService } from './memory/memory-storage.service';

@Injectable({ providedIn: 'root' })
export class StorageV2 {
  /**
   * global in-browser memory
   */
  memory = new MemoryStorageService();
  /**
   * session storage
   */
  session = new SessionStorageService();
  /**
   * Storage specific to the app
   */
  // app = new AppStorageService();
  /**
   * storage specific for a user
   */
  user: UserStorageService;

  constructor(session: Session) {
    const user = session.getLoggedInUser() as MindsUser;

    if (user) {
      this.user = new UserStorageService(user);
    }
  }
}
