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
  template: `
    <h3>{{ metric.title | titlecase }}</h3>
    <div
      class="mdl-spinner mdl-js-spinner is-active"
      [mdl]
      *ngIf="inProgress && !data[type].length"
    ></div>

    <table>
      <tbody>
        <tr *ngFor="let item of data[type]">
          <td [routerLink]="['/', item.user.guid]">
            <img
              class="m-admin--interactions--avatar"
              src="/icon/{{ item.user.guid }}/medium/{{ item.user.icontime }}"
            />
            @{{ item.user.username }}
          </td>
          <td>{{ item.value }}</td>
        </tr>

        <tr *ngIf="data[type].length === 0 && !inProgress">
          <td style="text-align: left" i18n="@@COMMON__ADMIN__NO_DATA">
            No data
          </td>
        </tr>
      </tbody>
    </table>
  `,
  host: {
    class: 'm-border',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InteractionsTableComponent implements OnInit, OnChanges {
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

  constructor(private client: Client, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.getLeaderboard();
    this.init = true;
  }

  ngOnChanges() {
    if (this.init) {
      this.getLeaderboard();
    }
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
}
