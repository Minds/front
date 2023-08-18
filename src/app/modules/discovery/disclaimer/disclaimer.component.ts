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
export class DiscoveryDisclaimerComponent implements OnDestroy {
  protected dismissibleId: string | null = null;

  private subscriptions: Subscription[] = [];

  constructor(private session: Session) {
    this.subscriptions.push(
      this.session.loggedinEmitter?.subscribe(() => {
        this.dismissibleId = LOGGED_IN_DISMISSIBLE_ID;
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
