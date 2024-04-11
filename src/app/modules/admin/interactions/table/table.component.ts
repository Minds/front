import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { Client } from '../../../../services/api/client';

@Component({
  selector: 'm-admin--interactions--table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InteractionsTableComponent implements OnInit {
  @Input() metric: { title: string; metric: string };
  timeout;

  @Input('type') set _type(value: 'actors' | 'beneficiaries') {
    this.type = value;
  }

  @Input('startDate') set _startDate(value: string) {
    this.startDate = value;
  }

  @Input('endDate') set _endDate(value: string) {
    this.endDate = value;
  }

  type: 'actors' | 'beneficiaries';
  startDate: string = '';
  endDate: string = '';

  inProgress: boolean = false;
  init: boolean = false;

  data: any = {
    actors: [],
    beneficiaries: [],
  };

  constructor(
    private client: Client,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getLeaderboard();
  }

  async getLeaderboard() {
    clearTimeout(this.timeout);

    let startDate = new Date(this.startDate),
      endDate = new Date(this.endDate);

    startDate.setHours(0, 0, 0);
    endDate.setHours(23, 59, 59);

    this.inProgress = true;

    this.detectChanges();

    try {
      const response: any = await this.client.get(
        `api/v2/admin/analytics/leaderboard/${this.type}/${this.metric.metric}`,
        {
          from: Math.floor(+startDate / 1000),
          to: Math.floor(+endDate / 1000),
        }
      );

      this.data[this.type] = response.counts[this.type];
    } catch (e) {
      console.error(e);
    }

    this.inProgress = false;

    this.detectChanges();

    if (endDate.toDateString() === new Date().toDateString()) {
      this.timeout = setTimeout(() => this.getLeaderboard(), 10000);
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  get isOffchain() {
    return this.metric.metric === 'offchain';
  }
}
