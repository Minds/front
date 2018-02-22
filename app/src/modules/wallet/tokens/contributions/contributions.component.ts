import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'm-wallet-token--contributions',
  templateUrl: 'contributions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletTokenContributionsComponent {
  startDate: string;
  endDate: string;
  inProgress: boolean = false;
  contributions: any[] = [];
  offset: string;
  moreData: boolean = true;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    public session: Session,
    protected router: Router,
  ) {

  }

  ngOnInit() {

    const d = new Date();

    d.setHours(23, 59, 59);
    this.endDate = d.toISOString();

    d.setMonth(d.getMonth() - 1);
    d.setHours(0, 0, 0);
    this.startDate = d.toISOString();

    this.load(true);
  }

  async load(refresh: boolean) {
    if (this.inProgress && !refresh) {
      return;
    }

    if (refresh) {
      this.contributions = [];
      this.offset = '';
      this.moreData = true;
    }

    this.inProgress = true;

    this.detectChanges();

    try {
      let startDate = new Date(this.startDate),
        endDate = new Date(this.endDate);

      startDate.setHours(0, 0, 0);
      endDate.setHours(23, 59, 59);

      let response: any = await this.client.get(`api/v2/blockchain/contributions`, {
        from: Math.floor(+startDate / 1000),
        to: Math.floor(+endDate / 1000),
        offset: this.offset
      });

      if (refresh) {
        this.contributions = [];
      }

      if (response) {
        this.contributions.push(...(response.contributions || []));

        if (response['load-next']) {
          this.offset = response['load-next'];
        } else {
          this.moreData = false;
        }
      } else {
        console.error('No data');
        this.moreData = false;
        // TODO: Show
      }
    } catch (e) {
      console.error(e);
      this.moreData = false;
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
}
