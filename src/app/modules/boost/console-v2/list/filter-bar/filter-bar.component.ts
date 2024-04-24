import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  BoostConsoleLocationFilter,
  BoostConsolePaymentMethodFilter,
  BoostConsoleStateFilter,
  BoostConsoleSuitabilityFilter,
} from '../../../boost.types';
import { BoostConsoleAdminStatsService } from '../../services/admin-stats.service';
import { BoostConsoleService } from '../../services/console.service';

/**
 * Filter bar component for Boost console.
 * Contains both tabs and filters, button to create a boost,
 * and a link to legacy console,
 *
 * Changing a filter/tab value changes the url query params only
 */
@Component({
  selector: 'm-boostConsole__filterBar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.ng.scss'],
})
export class BoostConsoleFilterBarComponent implements OnInit {
  // state filter type values.
  readonly stateFilterTypes: BoostConsoleStateFilter[] = [
    'all',
    'pending',
    'approved',
    'completed',
    'rejected',
  ];

  // location filter type values.
  readonly locationFilterTypes: BoostConsoleLocationFilter[] = [
    'all',
    'feed',
    'sidebar',
  ];

  // payment method type values.
  readonly paymentMethodFilterTypes: BoostConsolePaymentMethodFilter[] = [
    'all',
    'cash',
    'offchain_tokens',
    'onchain_tokens',
  ];

  // safe pending count for admins.
  public readonly adminPendingSafeCount$: Observable<number> =
    this.adminStats.pendingSafeCount$;

  // controversial pending count for admins.
  public readonly adminPendingControversialCount$: Observable<number> =
    this.adminStats.pendingControversialCount$;

  /**
   * What kind of boost latest post notice
   * should we show - post or channel?
   */
  @Input() boostLatestNoticeType: BoostConsoleLocationFilter;

  @Input() showDropdownFilters: boolean = true;

  constructor(
    public service: BoostConsoleService,
    private adminStats: BoostConsoleAdminStatsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadAdminStats();
  }

  public onStateFilterChange(val: BoostConsoleStateFilter): void {
    this.service.updateQueryParams({ state: val });
  }

  /**
   * Set location filter value
   *
   * @param val
   * @param triggeredFromTopTabRow as opposed to from a dropdown filter
   */
  public onLocationFilterChange(val: BoostConsoleLocationFilter): void {
    this.service.updateQueryParams({ location: val });
  }

  public onPaymentMethodFilterChange(
    val: BoostConsolePaymentMethodFilter
  ): void {
    this.service.updateQueryParams({ payment_method: val });
  }

  public onSuitabilityFilterChange(val: BoostConsoleSuitabilityFilter): void {
    this.service.updateQueryParams({ suitability: val });
    this.loadAdminStats();
  }

  /**
   * Load admin stats async if in an admin context.
   * @return { void }
   */
  private loadAdminStats(): void {
    if (this.service.adminContext$.getValue()) {
      this.adminStats.fetch(); // async
    }
  }

  protected onClickExploreTab($event): void {
    this.changeQuery({ explore: true });
  }

  protected onClickFeedTab($event): void {
    this.changeQuery({ location: 'feed' });
  }

  protected onClickSidebarTab($event): void {
    this.changeQuery({ location: 'sidebar' });
  }

  changeQuery(params: any): void {
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: params,
    });
  }

  /**
   * Called on settings button click - navigates to settings page.
   * @param { MouseEvent } $event - click event.
   * @returns { void }
   */
  public onClickSettingsButton($event: MouseEvent): void {
    this.router.navigate(['/settings/account/boosted-content']);
  }
}
