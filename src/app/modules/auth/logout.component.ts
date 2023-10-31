import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Templateless component that logs a user out and triggers a redirect.
 * this is intended to be bound to the /logout route in the router.
 */
@Component({
  template: ``,
})
export class LogoutComponent implements OnInit {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    const urlSegments: UrlSegment[] = this.route.snapshot.url;

    // async.
    this.logout(
      urlSegments &&
        urlSegments.length > 1 &&
        urlSegments[1].toString() === 'all'
    );
  }

  /**
   * Log a user out and navigate to /login.
   * @param { boolean } closeAllSessions - whether all sessions should be closed.
   * @returns { Promise<void> }
   */
  private async logout(closeAllSessions: boolean = false): Promise<void> {
    await this.auth.logout(closeAllSessions);
    this.router.navigate(['/login']);
  }
}
