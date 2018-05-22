import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Client } from '../../services/api';
import { Session } from '../../services/session';


@Component({
  template: ``
})

export class LogoutComponent {

  constructor(
    public client: Client,
    public router: Router,
    public route: ActivatedRoute,
    public session: Session,
  ) {
    this.route.url.subscribe(segments => {
      this.logout(segments && segments.length>1 && segments[1].toString() === 'all');
    });
  }

  logout(closeAllSessions: boolean = false) {
    let url: string = 'api/v1/authenticate';
    if (closeAllSessions)
      url += '/all';

    this.client.delete(url);
    this.session.logout();
    this.router.navigate(['/login']);
  }

}
