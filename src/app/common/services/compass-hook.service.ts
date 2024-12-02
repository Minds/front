import { Injectable } from '@angular/core';
import { CookieService } from '../../common/services/cookie.service';
import { Subscription } from 'rxjs';
import {
  CompassService,
  SOCIAL_COMPASS_ANSWERS_KEY,
} from '../../modules/compass/compass.service';
import { Session } from '../../services/session';

@Injectable({
  providedIn: 'root',
})
export class CompassHookService {
  loggedInSubscription: Subscription;

  constructor(
    private session: Session,
    private cookieService: CookieService,
    private compassService: CompassService
  ) {}

  /**
   * When a user logs in, check if they have social compass questions
   * saved in their local storage. If they do, save them
   */
  listen(): void {
    this.loggedInSubscription = this.session.loggedinEmitter.subscribe((is) => {
      if (is) {
        const answers = JSON.parse(
          this.cookieService.get(SOCIAL_COMPASS_ANSWERS_KEY)
        );

        if (answers) {
          this.compassService.answers$.next(answers);
          this.compassService.saveAnswers();
        }
      }
    });
  }

  static _(
    session: Session,
    cookieService: CookieService,
    compassService: CompassService
  ) {
    return new CompassHookService(session, cookieService, compassService);
  }
}
