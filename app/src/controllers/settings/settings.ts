import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { Client } from '../../services/api';
import { MindsTitle } from '../../services/ux/title';
import { SessionFactory } from '../../services/session';

@Component({
  moduleId: module.id,
  selector: 'minds-settings',
  templateUrl: 'settings.html'
})

export class Settings {

  minds: Minds;
  session = SessionFactory.build();
  user: any;
  filter: string;
  account_time_created: any;
  card: string;

  paramsSubscription: Subscription;

  constructor(public client: Client, public router: Router, public route: ActivatedRoute, public title: MindsTitle) {
  }

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    this.minds = window.Minds;

    this.title.setTitle('Settings');

    this.filter = 'general';

    this.account_time_created = window.Minds.user.time_created;

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['filter']) {
        this.filter = params['filter'];
      } else {
        this.filter = 'general';
      }
      if (params['card']) {
        this.card = params['card'];
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }
}
