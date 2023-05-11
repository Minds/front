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
 * including total earnings,
 * link to earnings table
 */
@Component({
  selector: 'm-affiliates__earnings',
  templateUrl: 'earnings.component.html',
  styleUrls: ['earnings.component.ng.scss'],
})
export class AffiliatesEarningsComponent {
  /** Amount user has earned through affiliate program */
  protected totalEarnings$: Observable<number> = this.metrics.metrics$.pipe(
    map((metrics: AffiliatesMetrics) => metrics.amount_usd ?? 0)
  );

  /** Whether metrics are in the process of loading */
  protected metricsLoading$: Observable<boolean> = this.metrics.loading$;

  /** Whether metrics are in the process of loading */
  protected metricsError$: Observable<boolean> = this.metrics.error$;

  constructor(private metrics: AffiliatesMetricsService) {}
}
