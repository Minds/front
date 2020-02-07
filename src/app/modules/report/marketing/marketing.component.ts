import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../common/api/client.service';
import { REASONS as REASONS_LIST } from '../../../services/list-options';
import { Session } from '../../../services/session';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-reports__marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsMarketingComponent {
  user;
  readonly cdnAssetsUrl: string;
  stats = {
    reported: 0,
    reportedPct: 0,
    actioned: 0,
    actionedPct: 0,
    appealedPct: 0,
    appealed: 0,
    upheldPct: 0,
    upheld: 0,
    overturned: 0,
  };
  reasons = REASONS_LIST;

  constructor(
    private client: Client,
    private cd: ChangeDetectorRef,
    private router: Router,
    public session: Session,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.user = this.session.getLoggedInUser();
  }

  ngOnInit() {
    this.loadStats();
  }

  startJuryDuty() {
    this.router.navigate(['/moderation/juryduty/initial']);
  }

  async loadStats() {
    let response: any = await this.client.get('api/v2/moderation/stats');
    this.stats = response.stats;
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
