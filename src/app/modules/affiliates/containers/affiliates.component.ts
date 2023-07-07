import { Component } from '@angular/core';
import { Session } from '../../../services/session';
import { Router } from '@angular/router';

/**
 * Settings page for Affiliates program
 * Contains program description, links to share buttons,
 * total earnings, etc.
 */
@Component({
  selector: 'm-affiliates',
  templateUrl: 'affiliates.component.html',
})
export class AffiliatesComponent {
  /**
   * Name of the referrer (aka current logged on user)
   */
  referrerUsername: string = '';

  /**
   * Total earnings that current user has
   * made through the affiliates program
   */
  totalEarnings: number = 0;

  constructor(private session: Session, public router: Router) {}

  ngOnInit() {
    if (!this.session.getLoggedInUser()) {
      return this.router.navigate(['/login']);
    }

    this.referrerUsername = this.session.getLoggedInUser().username;
  }
}
