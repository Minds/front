import { Component, Input } from '@angular/core';
import { AffiliatesEarnMethod } from '../../types/affiliates.types';
import { AffiliatesShareModalService } from '../../services/share-modal.service';
import {
  AffiliatesMetrics,
  AffiliatesMetricsService,
} from '../../services/affiliates-metrics.service';
import { Observable, map } from 'rxjs';

/**
 * Affiliate program earnings summary,
 * including total earnings, links to earn more,
 * link to earnings table
 */
@Component({
  selector: 'm-affiliates__earnings',
  templateUrl: 'earnings.component.html',
  styleUrls: ['earnings.component.ng.scss'],
})
export class AffiliatesEarningsComponent {
  /** Username of the referrer (aka current username) */
  @Input() referrerUsername: string = '';

  /** Amount user has earned through affiliate program */
  protected totalEarnings$: Observable<number> = this.metrics.metrics$.pipe(
    map((metrics: AffiliatesMetrics) => metrics.amount_usd ?? 0)
  );

  /** Whether metrics are in the process of loading */
  protected metricsLoading$: Observable<boolean> = this.metrics.loading$;

  /** Whether metrics are in the process of loading */
  protected metricsError$: Observable<boolean> = this.metrics.error$;

  constructor(
    private affiliatesShareModalService: AffiliatesShareModalService,
    private metrics: AffiliatesMetricsService
  ) {}

  /**
   * Opens the affiliate share modal with invite links
   */
  async openShareModal(): Promise<void> {
    const earnMethod: AffiliatesEarnMethod = 'affiliate';

    const opts = {
      referrerUsername: this.referrerUsername,
      earnMethod: earnMethod,
    };

    this.affiliatesShareModalService.open(opts);
  }
}
