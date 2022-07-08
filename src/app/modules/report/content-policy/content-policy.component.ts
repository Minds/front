import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Client } from '../../../common/api/client.service';
import { Session } from '../../../services/session';
import { ConfigsService } from '../../../common/services/configs.service';
import { ReportService } from '../../../common/services/report.service';

@Component({
  selector: 'm-reports__contentPolicy',
  templateUrl: 'content-policy.component.html',
  styleUrls: [
    '../../aux-pages/aux-pages.component.ng.scss',
    './content-policy.component.ng.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsContentPolicyComponent {
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
  reasons = this.reportService.reasons;

  constructor(
    private client: Client,
    private cd: ChangeDetectorRef,
    private router: Router,
    public session: Session,
    private reportService: ReportService,
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
