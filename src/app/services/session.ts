/**
 * Sessions
 */
import { EventEmitter, Injectable } from '@angular/core';
import { ConfigsService } from '../common/services/configs.service';
import { Storage } from './storage';
import { BehaviorSubject } from 'rxjs';
import { MindsUser } from '../interfaces/entities';

@Injectable()
export class Session {
  loggedinEmitter: EventEmitter<any> = new EventEmitter();
  userEmitter: EventEmitter<any> = new EventEmitter();
  readonly user$: BehaviorSubject<MindsUser | null> = new BehaviorSubject<MindsUser | null>(
    null
  );

  constructor(private configs: ConfigsService, private storage: Storage) {
    this.user$.next(this.configs.get('user') || null);
  }

  /**
   * Return if loggedin, with an optional listener
   */
  isLoggedIn(observe: any = null) {
    if (observe) {
      this.loggedinEmitter.subscribe({
        next: is => {
          if (is) observe(true);
          else observe(false);
        },
      });
    }

    if (this.configs.get('LoggedIn')) return true;

    return false;
  }

  /**
   * True if the currently loggedin user is an admin
   */
  isAdmin() {
    if (!this.isLoggedIn) return false;
    if (this.configs.get('Admin')) return true;

    return false;
  }

  /**
   * Get the loggedin user
   */
  getLoggedInUser(observe: any = null) {
    if (observe) {
      this.userEmitter.subscribe({
        next: user => {
          observe(user);
        },
      });
    }

    const user = this.configs.get('user');

    if (user) {
      // Attach user_guid to debug logs
      return user;
    }

    return false;
  }

  inject(user: any = null) {
    // Clear stale localStorage

    this.storage.clear();

    // Emit new user info

    this.userEmitter.next(user);

    // Emit to subject

    this.user$.next(user ? (user as MindsUser) : null);

    // Set globals
    this.configs.set('LoggedIn', true);
    this.configs.set('user', user);

    if (user.admin === true) {
      this.configs.set('Admin', true);
    }
  }

  /**
   * Inject user and emit login event
   */
  login(user: any = null) {
    this.inject(user);
    this.loggedinEmitter.next(true);
  }

  /**
   * Emit logout event
   */
  logout() {
    this.userEmitter.next(null);
    this.user$.next(null);
    this.configs.set('user', null);
    this.configs.set('LoggedIn', false);
    this.configs.set('Admin', false);
    this.storage.clear();
    this.loggedinEmitter.next(false);
  }
}
