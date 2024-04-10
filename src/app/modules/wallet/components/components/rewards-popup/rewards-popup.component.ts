import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef,
} from '@angular/core';
import { WalletV2Service } from '../../wallet-v2.service';

import * as moment from 'moment';

/**
 * Popup in token transactions table that displays details of
 * a user's daily rewards and a breakdown of how they earned them
 *
 * TODO: verify that this component is still used
 */
@Component({
  selector: 'm-walletRewardsPopup',
  templateUrl: './rewards-popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletRewardsPopupComponent implements OnInit {
  @Input() timestamp;
  inProgress: boolean;
  totalScore;
  metrics;

  constructor(
    protected walletService: WalletV2Service,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load();
  }
  async load() {
    this.inProgress = true;
    const startOfDay = moment(this.timestamp * 1000)
      .utc()
      .startOf('day')
      .format('X');

    const opts = {
      from: startOfDay,
      to: Number(startOfDay) + 86400, // 24 hours later
    };
    try {
      const response =
        await this.walletService.getDailyTokenContributionScores(opts);

      if (response) {
        const dailyContributions = response.contributions[0];
        this.totalScore = dailyContributions.score;
        this.metrics = [];
        Object.keys(dailyContributions.metrics).forEach((key) => {
          const metric = dailyContributions.metrics[key];
          metric.id = key;
          metric.label = this.getLabel(metric);
          this.metrics.push(metric);
        });
      }
    } catch (e) {}
    this.inProgress = false;
    this.detectChanges();
  }

  getLabel(metric) {
    const metricLabels: any = {
      comments: {
        plural: 'comments',
        single: 'comment',
      },
      reminds: {
        plural: 'reminds',
        single: 'remind',
      },
      votes: {
        plural: 'votes',
        single: 'vote',
      },
      subscribers: {
        plural: 'subscribers',
        single: 'subscriber',
      },
      referrals: {
        plural: 'referrals',
        single: 'referral',
      },
      referrals_welcome: {
        plural: 'referrals',
        single: 'referral',
      },
      checkins: {
        plural: 'check-ins',
        single: 'check-in',
      },
      jury_duty: {
        plural: 'jury duties',
        single: 'jury duty',
      },
      onchain_tx: {
        plural: 'on-chain transactions',
        single: 'on-chain transaction',
      },
    };

    if (metricLabels[metric.id]) {
      const labelObj = metricLabels[metric.id];
      if (metric.amount === '1') {
        return labelObj.single;
      } else {
        return labelObj.plural;
      }
    } else {
      return metric.id;
    }
  }
  detectChanges() {
    if (!(this.cd as ViewRef).destroyed) {
      this.cd.markForCheck();
      this.cd.detectChanges();
    }
  }
}
