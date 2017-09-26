import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Session, SessionFactory } from '../../../services/session';

export type BoostConsoleType = 'newsfeed' | 'content' | 'peer';
export type BoostConsoleFilter = 'inbox' | 'outbox';

@Component({
  moduleId: module.id,
  selector: 'm-boost-console',
  templateUrl: 'console.component.html'
})
export class BoostConsoleComponent {

  type: BoostConsoleType;
  filter: BoostConsoleFilter;
  toggled: boolean;

  session: Session = SessionFactory.build();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    if (!this.activatedRoute.snapshot.params['type']) {
      this.router.navigateByUrl('/wallet/boost/newsfeed', { replaceUrl: true });
      return;
    }

    this.activatedRoute.params.subscribe(params => {
      if (params['type']) {
        this.type = params['type'];
      }

      if (params['toggled']) {
        this.toggled = params['toggled'];
      }

      this.filter = params['filter'] || 'inbox';
    });

    if (!this.type) {
      this.type = 'newsfeed';
    }
  }

}
