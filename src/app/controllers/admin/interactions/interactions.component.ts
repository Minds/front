import { Component } from '@angular/core';
import { Client } from '../../../services/api';

@Component({
  selector: 'm-admin--interactions',
  templateUrl: 'interactions.component.html',
})
export class AdminInteractions {
  metrics = [
    {
      title: 'Votes Up',
      metric: 'vote:up',
    },
    {
      title: 'Votes Down',
      metric: 'vote:down',
    },
    {
      title: 'Comments',
      metric: 'comment',
    },
    {
      title: 'Subscribers',
      metric: 'subscribe',
    },
    {
      title: 'Reminds',
      metric: 'remind',
    },
    {
      title: 'Referrals',
      metric: 'referral',
    },
  ];

  startDate: string;
  endDate: string;

  type: 'actors' | 'beneficiaries' = 'actors';

  constructor(public client: Client) {
    const d = new Date();

    d.setHours(23, 59, 59);
    this.endDate = d.toISOString();

    d.setDate(d.getDate() - 1);
    d.setHours(0, 0, 0);
    this.startDate = d.toISOString();
  }

  onStartDateChange(newDate) {
    this.startDate = newDate;
  }

  onEndDateChange(newDate) {
    this.endDate = newDate;
  }

  show(data: 'actors' | 'beneficiaries') {
    this.type = data;
  }
}
