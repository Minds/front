import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Session, SessionFactory } from '../../../services/session';
import { Client } from '../../../services/api/client';

export type BoostConsoleType = 'newsfeed' | 'content' | 'peer' | 'publisher';
export type BoostConsoleFilter = 'create' | 'history' | 'earnings' | 'payouts' | 'settings' | 'inbox' | 'outbox';

@Component({
  moduleId: module.id,
  selector: 'm-boost-console',
  templateUrl: 'console.component.html'
})
export class BoostConsoleComponent {

  type: BoostConsoleType;
  filter: BoostConsoleFilter;

  session: Session = SessionFactory.build();

  minds: Minds = window.Minds;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {

    if (!this.activatedRoute.snapshot.params['type']) {
      this.router.navigateByUrl('/boost/console/newsfeed', { replaceUrl: true });
      return;
    }

    this.activatedRoute.params.subscribe(params => {
      if (params['type']) {
        this.type = params['type'];
      }

      this.filter = params['filter'] || 'inbox';
    });

    if (!this.type) {
      this.type = 'newsfeed';
    }
  }
}
