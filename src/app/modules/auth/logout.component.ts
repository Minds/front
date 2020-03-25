import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  template: ``,
})
export class LogoutComponent {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public auth: AuthService
  ) {
    this.route.url.subscribe(segments => {
      this.logout(
        segments && segments.length > 1 && segments[1].toString() === 'all'
      );
    });
  }

  logout(closeAllSessions: boolean = false) {
    this.auth.logout(closeAllSessions);
    this.router.navigate(['/login']);
  }
}
