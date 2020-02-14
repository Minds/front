import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef,
} from '@angular/core';
import { WalletDashboardService } from '../dashboard.service';

import * as moment from 'moment';

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
    protected walletService: WalletDashboardService,
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
      to: startOfDay + 86400, // 24 hours later
    };
    const response = await this.walletService.getDailyTokenContributionScores(
      opts
    );

    if (response) {
      const dailyContributions = response.contributions[0];
      this.totalScore = dailyContributions.score;
      this.metrics = [];
      Object.keys(dailyContributions.metrics).forEach(key => {
        const metric = dailyContributions.metrics[key];
        metric.key = key;
        metric.id = key;
        this.metrics.push(metric);
      });
    }
    this.inProgress = false;
    this.detectChanges();
  }
  detectChanges() {
    if (!(this.cd as ViewRef).destroyed) {
      this.cd.markForCheck();
      this.cd.detectChanges();
    }
  }
}
