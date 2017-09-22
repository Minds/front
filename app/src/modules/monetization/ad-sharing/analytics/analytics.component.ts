import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Client } from '../../../../services/api';

@Component({
  moduleId: module.id,
  templateUrl: 'analytics.component.html',
  selector: 'm-wallet-ad-sharing-analytics',
})
export class AdSharingAnalyticsComponent {

  overview = {
    today: 0,
    last7: 0,
    last28: 0,
    balanceDays: 40,
    balanceAmount: 0,
  };

  payouts = {
    status: '',
    available: false,
    amount: 0,
    dates: {
      start: 0,
      end: 0,
    }
  };

  breakdown = {
    period: 28,
    dates: {
      start: 0,
      end: 0,
    }
  };

  items: any[] = [];
  period: number = 28;
  username: string = '';

  loaded: boolean = false;
  isMerchant: boolean = false;
  canBecomeMerchant: boolean = false;

  overviewInProgress: boolean = false;
  payoutRequestInProgress: boolean = false;
  inProgress: boolean = false;
  moreData: boolean = true;
  offset: string = '';

  listLoaded: boolean = false;

  paramsSubscription: Subscription;

  constructor(private client: Client, private route: ActivatedRoute, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params: any) => {
      if (typeof params['username'] !== 'undefined') {
        let changed = this.username !== params['username'];
        this.username = params['username'];

        if (changed) {
          this.load();
          this.listLoaded = false;
          this.items = [];
        }

        this.detectChanges();
      }
    });

    this.load()
      .then(() => {
        if (this.hasBreakdown()) {
          this.loadList(28, true);
        }
      });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  load(): Promise<any> {
    this.overviewInProgress = true;
    this.detectChanges();

    return this.client.get(`api/v1/monetization/ads/overview/${this.username}`)
      .then((response: any) => {
        this.overviewInProgress = false;

        if (response.overview) {
          this.overview = response.overview;
        }

        if (response.payouts) {
          this.payouts = response.payouts;
        }

        this.isMerchant = !!response.isMerchant;
        this.canBecomeMerchant = !!response.canBecomeMerchant;
        this.loaded = true;
        this.detectChanges();
      })
      .catch(e => {
        this.overviewInProgress = false;
        this.detectChanges();
      });
  }

  loadList(period: number, refresh: boolean): Promise<any> {
    this.breakdown.period = period;
    if (refresh) {
      this.offset = '';
      this.moreData = true;
      this.items = [];
      this.detectChanges();
    }

    if (this.inProgress) {
      return Promise.reject(false);
    }

    this.inProgress = true;
    this.listLoaded = true;
    this.detectChanges();

    return this.client.get(`api/v1/monetization/ads/list/${this.username}`, { offset: this.offset, period: period })
      .then((response: any) => {
        this.inProgress = false;

        if (response.breakdown && response.breakdown.list) {
          this.items.push(...response.breakdown.list);
        } else {
          this.moreData = false;
        }

        if (response.breakdown && response.breakdown.dates) {
          this.breakdown.dates = response.breakdown.dates;
        }

        if (response['load-next']) {
          this.offset = response['load-next'];
        } else {
          this.moreData = false;
        }

        this.detectChanges();
      })
      .catch(e => {
        this.inProgress = false;
        this.detectChanges();
      });
  }

  payout() {
    if (!this.canPayout() || this.payoutRequestInProgress) {
      return;
    }

    this.payoutRequestInProgress = true;
    this.detectChanges();

    this.client.post('api/v1/monetization/ads/payout')
      .then(response => {
        this.payoutRequestInProgress = false;
        this.payouts.available = false;
        this.payouts.status = 'inprogress';
        this.detectChanges();
      })
      .catch(e => {
        this.payoutRequestInProgress = false;
        this.detectChanges();
      });
  }

  canPayout() {
    return !!this.payouts.available;
  }

  isPayoutInProgress() {
    return this.payouts.status === 'inprogress';
  }

  hasBreakdown() {
    return this.payouts && this.payouts.dates.start && this.payouts.dates.end;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
