import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'm-wallet-token--overview',
  templateUrl: 'overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletTokenContributionsOverviewComponent
  implements OnInit, OnDestroy {
  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    public session: Session,
    protected router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  overview = {
    nextPayout: null,
    currentReward: null,
    yourContribution: null,
    totalNetworkContribution: null,
    yourShare: null,
  };

  protected updateTimer$;

  ngOnInit() {
    this.load();
    if (isPlatformBrowser(this.platformId))
      this.updateTimer$ = setInterval(this.updateNextPayout.bind(this), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.updateTimer$);
  }

  async load() {
    try {
      const result: any = await this.client.get(
        `api/v2/blockchain/contributions/overview`
      );

      this.overview.nextPayout = result.nextPayout;
      this.overview.currentReward = result.currentReward;
      this.overview.yourContribution = result.yourContribution;
      this.overview.totalNetworkContribution = result.totalNetworkContribution;
      this.overview.yourShare = result.yourShare;

      this.detectChanges();
    } catch (e) {
      console.error(e);
    }
  }

  updateNextPayout() {
    if (this.overview.nextPayout) {
      this.overview.nextPayout--;
      this.detectChanges();
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
