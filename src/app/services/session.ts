/**
 * Sessions
 */
import { EventEmitter, Injectable } from '@angular/core';
import { ConfigsService } from '../common/services/configs.service';

@Injectable()
export class Session {
  loggedinEmitter: EventEmitter<any> = new EventEmitter();
  userEmitter: EventEmitter<any> = new EventEmitter();

  constructor(private configs: ConfigsService) {}

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

    window.localStorage.clear();

    // Emit new user info

    this.userEmitter.next(user);

    // Set globals

    window.Minds.LoggedIn = true;
    window.Minds.user = user;

    if (user.admin === true) {
      window.Minds.Admin = true;
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
    delete window.Minds.user;
    window.Minds.LoggedIn = false;
    window.Minds.Admin = false;
    window.localStorage.clear();
    this.loggedinEmitter.next(false);
  }
}
