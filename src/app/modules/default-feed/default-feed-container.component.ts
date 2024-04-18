import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../../services/session';

/**
 * Container for default feed - contains page layout and sidebar.
 */
@Component({
  selector: 'm-defaultFeed__container',
  templateUrl: 'default-feed-container.component.html',
  styleUrls: ['./default-feed-container.component.ng.scss'],
})
export class DefaultFeedContainerComponent implements OnInit {
  constructor(
    private router: Router,
    private session: Session
  ) {}

  public ngOnInit(): void {
    if (this.session.isLoggedIn()) {
      this.router.navigate(['/newsfeed']);
      return;
    }
  }
}
