import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MindsUser } from '../../interfaces/entities';
import { Session } from '../session';
import { MemoryStorageService } from './memory/memory-storage.service';
import { SessionStorageService } from './session/session-storage.service';
import { UserStorageService } from './user/user-storage.service';

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
   * Storage specific to the app (shared data among users)
   */
  // app = new AppStorageService();
  /**
   * storage specific for a user
   */
  user: UserStorageService;

  // TODO: make sure SSR isn't a problem
  constructor(session: Session, @Inject(PLATFORM_ID) platformId) {
    const user = session.getLoggedInUser() as MindsUser;

    if (user) {
      this.user = new UserStorageService(user);
    }
  }
}
