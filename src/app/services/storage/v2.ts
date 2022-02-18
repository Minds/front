import { MindsUser } from './../../interfaces/entities';
import { Session } from './../session';
import { Injectable } from '@angular/core';
import { UserStorageService } from './user/user-storage.service';

@Injectable()
export class StorageV2 {
  // memory = new MemoryStorageService();
  // session = new SessionStorageService();
  // app = new AppStorageService();
  user: UserStorageService;

  constructor(private session: Session) {
    const user = this.session.getLoggedInUser() as MindsUser;

    if (user) {
      this.user = new UserStorageService(user);
    }
  }
}
