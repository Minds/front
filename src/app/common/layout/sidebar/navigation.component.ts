import { Component } from '@angular/core';

import { Navigation as NavigationService } from '../../../services/navigation';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-sidebar--navigation',
  templateUrl: 'navigation.component.html',
})
export class SidebarNavigationComponent {
  user;

  constructor(public navigation: NavigationService, public session: Session) {
    this.getUser();
  }

  getUser() {
    this.user = this.session.getLoggedInUser(user => {
      this.user = user;
    });
  }
}
