import { Component } from '@angular/core';

import { Session } from '../../../../services/session';
import { Router } from '@angular/router';

@Component({
  selector: 'm-analytics__admin',
  templateUrl: 'admin.component.html',
})
export class AdminAnalyticsComponent {
  constructor(public session: Session, public router: Router) {
    if (!this.session.isAdmin()) {
      this.router.navigate(['/']);
    }
  }
}
