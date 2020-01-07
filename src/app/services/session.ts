/**
 * Sessions
 */
import { EventEmitter } from '@angular/core';

export class Session {
  loggedinEmitter: EventEmitter<any> = new EventEmitter();
  userEmitter: EventEmitter<any> = new EventEmitter();

  static _() {
    return new Session();
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

    if (window.Minds.LoggedIn) return true;

    return false;
  }

  isAdmin() {
    if (!this.isLoggedIn) return false;
    if (window.Minds.Admin) return true;

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

    if (window.Minds.user) {
      // Attach user_guid to debug logs
      return window.Minds.user;
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
