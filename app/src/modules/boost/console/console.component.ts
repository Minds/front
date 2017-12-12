import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Session, SessionFactory } from '../../../services/session';
import { Client } from '../../../services/api/client';

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
  startDate: string;

  stats = {
    points_count: 0,
    usd_count: 0,
    points_earnings: 0,
    usd_earnings: 0
  };

  minds: Minds = window.Minds;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private client: Client) {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    this.startDate = d.toISOString();
  }

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

    if (this.minds.user.show_boosts) {
      this.getStatistics();
    }
  }

  getStatistics() {
    this.client.get('api/v1/boost/sums', { start: Date.parse(this.startDate) }).then((res: any) => {
      this.stats.points_count = res.points_count;
      this.stats.points_earnings = res.points_earnings;
      this.stats.usd_count = res.usd_count;
      this.stats.usd_earnings = res.usd_earnings;
    });
  }

  becomeAPublisher() {
    this.minds.user.show_boosts = true;
    this.client.post(`api/v1/settings/${this.minds.user.guid}`, { 'show_boosts': true })
      .then(() => {
        this.getStatistics();
      })
      .catch(() => {
        this.minds.user.show_boosts = false;
      });
  }

  onStartDateChange(newDate) {
    this.startDate = newDate;
    this.getStatistics();
  }

  isMerchant() {
    const user = this.session.getLoggedInUser();
    return user && user.merchant;
  }
}
