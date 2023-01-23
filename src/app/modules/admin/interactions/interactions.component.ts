import { Component, OnInit } from '@angular/core';
import { PageLayoutService } from '../../../common/layout/page-layout.service';
import { Client } from '../../../services/api';

@Component({
  selector: 'm-admin--interactions',
  templateUrl: 'interactions.component.html',
  styleUrls: ['interactions.component.ng.scss'],
})
export class AdminInteractions implements OnInit {
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
    {
      title: 'Offchain Wires',
      metric: 'offchain',
    },
  ];

  startDate: string;
  endDate: string;

  type: 'actors' | 'beneficiaries' = 'actors';

  constructor(
    public client: Client,
    public pageLayoutService: PageLayoutService
  ) {
    const d = new Date();

    d.setHours(23, 59, 59);
    this.endDate = d.toISOString();

    d.setDate(d.getDate() - 1);
    d.setHours(0, 0, 0);
    this.startDate = d.toISOString();
  }

  ngOnInit(): void {
    this.pageLayoutService.useFullWidth();
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
