import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Session, SessionFactory } from '../../../services/session';
import { Client } from '../../../services/api/client';

export type BoostConsoleType = 'newsfeed' | 'content' | 'peer' | 'publisher';
export type BoostConsoleFilter = 'create' | 'history' | 'earnings' | 'payouts' | 'settings' | 'inbox' | 'outbox';

@Component({
  selector: 'm-boost-console--types',
  templateUrl: 'types.component.html'
})
export class BoostConsoleTypesComponent {

  type: BoostConsoleType;
  filter: BoostConsoleFilter;

  session: Session = SessionFactory.build();

  minds: Minds = window.Minds;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {

  }

}
