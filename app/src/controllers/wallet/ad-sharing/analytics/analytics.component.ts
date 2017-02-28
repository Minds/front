import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Client } from '../../../../services/api';

@Component({
  moduleId: module.id,
  templateUrl: 'analytics.component.html',
  selector: 'minds-wallet-ad-sharing-analytics',
})
export class WalletAdSharingAnalytics {
  overview = {
    today: 0,
    last7: 0,
    lastRetentionDays: 0,
    lastRetentionAmount: 0,
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

  items: any[] = [];
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

  constructor(private client: Client, private route: ActivatedRoute) { }

  paramsSubscription: Subscription;
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
      }
    });

    this.load()
      .then(() => {
        if (this.hasBreakdown()) {
          this.loadList(true);
        }
      });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  load(): Promise<any> {
    this.overviewInProgress = true;
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
      })
      .catch(e => {
        this.overviewInProgress = false;
      });
  }

  loadList(refresh: boolean): Promise<any> {
    if (refresh) {
      this.offset = '';
      this.moreData = true;
      this.items = [];
    }

    if (this.inProgress) {
      return Promise.reject(false);
    }

    this.inProgress = true;
    this.listLoaded = true;
    return this.client.get(`api/v1/monetization/ads/list/${this.username}`, { offset: this.offset })
      .then((response: any) => {
        this.inProgress = false;

        if (response.payouts && response.payouts.list) {
          this.items.push(...response.payouts.list);
        } else {
          this.moreData = false;
        }

        if (response.payouts && response.payouts.dates) {
          this.payouts.dates = response.payouts.dates;
        }

        if (response['load-next']) {
          this.offset = response['load-next'];
        } else {
          this.moreData = false;
        }
      })
      .catch(e => {
        this.inProgress = false;
      });
  }

  payout() {
    if (!this.canPayout() || this.payoutRequestInProgress) {
      return;
    }

    this.payoutRequestInProgress = true;

    this.client.post('api/v1/monetization/ads/payout')
      .then(response => {
        this.payoutRequestInProgress = false;
        this.payouts.available = false;
        this.payouts.status = 'inprogress';
      })
      .catch(e => {
        this.payoutRequestInProgress = false;
      });
  }

  canPayout() {
    return !!this.payouts.available;
  }

  isPayoutInProgress() {
    return this.payouts.status == 'inprogress';
  }

  hasBreakdown() {
    return this.payouts && this.payouts.dates.start && this.payouts.dates.end;
  }
}
