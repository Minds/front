import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Session } from '../../../services/session';

@Injectable()
export class BannedService {
  constructor(
    private router: Router,
    private session: Session
  ) {
    this.router.events.subscribe((navigationState) => {
      if (navigationState instanceof NavigationStart) {
        // Forward to moderation banned page if banned
        if (
          this.session.getLoggedInUser().banned === 'yes' &&
          navigationState.url != '/moderation/banned'
        ) {
          this.router.navigate(['/moderation/banned']);
        }
        // Do not allow access to banned page if not banned
        if (
          this.session.getLoggedInUser().banned !== 'yes' &&
          navigationState.url === '/moderation/banned'
        ) {
          this.router.navigate(['/newsfeed']);
        }
      }
    });
  }
}
