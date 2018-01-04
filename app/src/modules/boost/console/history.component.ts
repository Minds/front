import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Session, SessionFactory } from '../../../services/session';
import { Client } from '../../../services/api/client';

export type BoostConsoleType = 'newsfeed' | 'content' | 'peer' | 'publisher';
export type BoostConsoleFilter = 'create' | 'history' | 'earnings' | 'payouts' | 'settings' | 'inbox' | 'outbox';

@Component({
  selector: 'm-boost-console--history',
  templateUrl: 'history.component.html'
})
export class BoostConsoleHistoryComponent {

  type: BoostConsoleType = 'newsfeed';
  filter: BoostConsoleFilter;

  session: Session = SessionFactory.build();

  minds: Minds = window.Minds;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {

    this.route.parent.url.subscribe(segments => {
      this.type = <BoostConsoleType>segments[0].path;
    });

    this.route.params.subscribe(params => {
      this.filter = params['filter'];
    });

  }
}
