import { Component, OnDestroy, OnInit } from '@angular/core';
import { Session } from '../../../services/session';
import { Subscription } from 'rxjs';

const LOGGED_IN_DISMISSIBLE_ID = 'discovery-disclaimer-2020';
/**
 * Sidebar widget shown to logged out users.
 * Contains links to Minds resources that might
 * convince someone to learn about and join Minds
 *
 * Dismissible only when logged in
 */
@Component({
  selector: 'm-discovery__disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.ng.scss'],
})
export class DiscoveryDisclaimerComponent implements OnInit, OnDestroy {
  protected dismissibleId: string | null = null;

  private subscriptions: Subscription[] = [];

  constructor(private session: Session) {}

  ngOnInit(): void {
    this.dismissibleId = this.session.isLoggedIn()
      ? LOGGED_IN_DISMISSIBLE_ID
      : null;

    this.subscriptions.push(
      this.session.loggedinEmitter?.subscribe((isLoggedIn: boolean): void => {
        this.dismissibleId = isLoggedIn ? LOGGED_IN_DISMISSIBLE_ID : null;
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription?.unsubscribe();
    }
  }
}
