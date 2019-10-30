import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnalyticsDashboardService } from '../../dashboard.service';
import fakeData from './../../fake-data';

@Component({
  selector: 'm-analytics__layout--summary',
  templateUrl: './layout-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsLayoutSummaryComponent implements OnInit, OnDestroy {
  // metricsSubscription: Subscription;
  loading = true;
  // activeUsers;
  tiles;
  boosts;

  constructor(
    private analyticsService: AnalyticsDashboardService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // TODO: confirm how permissions/security will work

    this.tiles = fakeData[3].tiles;

    this.boosts = fakeData[4].boosts;

    this.loading = false;
    this.detectChanges();
  }
  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    // this.metricsSubscription.unsubscribe();
  }
}
