import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformServer } from '@angular/common';

import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';

@Component({
  selector: 'm-wallet-token--contributions',
  templateUrl: 'contributions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletTokenContributionsComponent {
  startDate: string;
  endDate: string;
  inProgress: boolean = false;
  contributions: any[] = [];
  metrics: Array<any> = [];

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    public session: Session,
    protected router: Router,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {}

  ngOnInit() {
    const d = new Date();

    d.setHours(23, 59, 59);
    this.endDate = d.toISOString();
    d.setDate(d.getDate() - 7);
    d.setHours(0, 0, 0);
    this.startDate = d.toISOString();

    this.load(true);
  }

  async load(refresh: boolean) {
    if (this.inProgress && !refresh) {
      return;
    }

    if (isPlatformServer(this.platformId)) {
      return;
    }

    if (refresh) {
      this.contributions = [];
    }

    this.inProgress = true;

    this.detectChanges();

    try {
      let startDate = new Date(this.startDate),
        endDate = new Date(this.endDate);

      startDate.setHours(0, 0, 0);
      endDate.setHours(23, 59, 59);

      let response: any = await this.client.get(
        `api/v2/blockchain/contributions`,
        {
          from: Math.floor(+startDate / 1000),
          to: Math.floor(+endDate / 1000),
        }
      );

      if (refresh) {
        this.contributions = [];
      }

      if (response) {
        response.contributions.forEach((item, index) => {
          response.contributions[index].detailedMetrics = [];
          response.contributions[index].visible = false;
          Object.keys(item.metrics).forEach(key => {
            let data = item.metrics[key];
            data.key = key;
            const share = (data.score / item.score) * item.share;
            data.share = share;
            response.contributions[index].detailedMetrics.push(data);
          });
        });
        this.contributions.push(...(response.contributions || []));
      } else {
        console.error('No data');
        // TODO: Show
      }
    } catch (e) {
      console.error(e);
      // TODO: Show
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  onStartDateChange(newDate) {
    this.startDate = newDate;
    this.load(true);
  }

  onEndDateChange(newDate) {
    this.endDate = newDate;
    this.load(true);
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  toggleCollapse(item) {
    item.visible = !item.visible;
  }
}
