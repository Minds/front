import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../../../../../services/session';
import { Client } from '../../../../../services/api/client';

@Component({
  moduleId: module.id,
  selector: 'm-wallet-token--withdraw-ledger',
  templateUrl: 'ledger.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WalletTokenWithdrawLedgerComponent implements OnInit {

  startDate: string;
  endDate: string;
  inProgress: boolean = false;
  withdrawals: any[] = [];
  offset: string;
  moreData: boolean = true;

  @Input() preview: boolean = false; // Preview mode

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected router: Router,
    protected session: Session,
  ) {

  }

  ngOnInit() {

    //if (!this.session.getLoggedInUser().rewards) {
    //  this.router.navigate(['/wallet/tokens/contributions/join']);
    //}

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
      this.withdrawals = [];
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

      let response: any = await this.client.get(`api/v2/blockchain/transactions/withdrawals`, {
        from: Math.floor(+startDate / 1000),
        to: Math.floor(+endDate / 1000),
        offset: this.offset
      });

      if (refresh) {
        this.withdrawals = [];
      }

      if (response) {
        this.withdrawals.push(...(response.withdrawals || []));

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

  prepend(request) {
    this.withdrawals.unshift(request);
    this.detectChanges();
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
