import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Session } from '../../../services/session';
import { Client } from '../../../services/api/client';

export type BoostConsoleType = 'newsfeed' | 'content' | 'offers' | 'publisher';
export type BoostConsoleFilter =
  | 'create'
  | 'history'
  | 'earnings'
  | 'payouts'
  | 'settings'
  | 'inbox'
  | 'outbox';

@Component({
  selector: 'm-boost-console--history',
  templateUrl: 'history.component.html',
})
export class BoostConsoleHistoryComponent {
  type: BoostConsoleType = 'newsfeed';
  filter: BoostConsoleFilter;

  constructor(
    public session: Session,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.parent.url.subscribe(segments => {
      this.type = <BoostConsoleType>segments[0].path;
    });

    this.route.params.subscribe(params => {
      this.filter = params['filter'];
    });
  }
}
