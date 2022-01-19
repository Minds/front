import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../../services/session';

/**
 * Container for default feed - contains page layout and sidebar.
 */
@Component({
  selector: 'm-defaultFeed__container',
  templateUrl: 'container.component.html',
  styleUrls: ['./container.component.ng.scss'],
})
export class DefaultFeedContainerComponent implements OnInit {
  constructor(private router: Router, private session: Session) {}

  // ojm currently, guestmode uses this until logged in
  // ojm get rid of this?
  public ngOnInit(): void {
    if (this.session.isLoggedIn()) {
      this.router.navigate(['/newsfeed']);
      return;
    }
  }
}
