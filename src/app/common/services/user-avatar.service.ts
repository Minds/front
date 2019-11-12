/**
 * @author Ben Hayward
 * @desc Singleton service used to store the current user avatar as a BehaviorSubject.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Session } from '../../services/session';
import { MindsUser } from '../../interfaces/entities';

@Injectable({
  providedIn: 'root',
})
export class UserAvatarService {
  private minds = window.Minds;
  private user: MindsUser;
  public src$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public loggedIn$: Subscription;

  constructor(public session: Session) {
    this.init();

    // Subscribe to loggedIn$ and on login, update src$.
    if (this.session.loggedinEmitter) {
      this.loggedIn$ = this.session.loggedinEmitter.subscribe(is => {
        if (is) {
          this.src$.next(this.getSrc());
        }
      });
    }
  }

  /**
   * Sets the current user and avatar src.
   */
  public init(): void {
    this.user = this.session.getLoggedInUser();
    this.src$.next(this.getSrc());
  }

  /**
   * Gets the Src string using the global minds object and the held user object.
   */
  public getSrc(): string {
    return `${this.minds.cdn_url}icon/${this.user.guid}/large/${this.user.icontime}`;
  }
}
