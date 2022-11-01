import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  SupermindConsoleListType,
  SupermindConsoleStatusFilterType,
  SupermindState,
} from '../../../supermind.types';
import { SupermindConsoleService } from '../../services/console.service';

/**
 * Filter bar component for Supermind console.
 */
@Component({
  selector: 'm-supermind__filterBar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.ng.scss'],
})
export class SupermindConsoleFilterBarComponent implements OnInit, OnDestroy {
  // filter type values.
  readonly statusFilterTypes: SupermindConsoleStatusFilterType[] = [
    'all',
    'pending',
    'accepted',
    'revoked',
    'rejected',
    'failed',
    'failed_payment',
    'expired',
  ];

  // status filter values.
  public readonly statusFilterValue$: BehaviorSubject<
    SupermindConsoleStatusFilterType
  > = new BehaviorSubject<SupermindConsoleStatusFilterType>(null);

  private listTypeSubscription: Subscription;

  // fired on filter state change.
  @Output() statusFilterChange: EventEmitter<SupermindState> = new EventEmitter<
    SupermindState
  >();

  constructor(private service: SupermindConsoleService) {}

  ngOnInit(): void {
    // set default filter values on list type change.
    this.listTypeSubscription = this.service.listType$.subscribe(
      (listType: SupermindConsoleListType): void => {
        if (listType === 'inbox') {
          this.onStatusFilterChange('pending');
          return;
        }
        this.onStatusFilterChange('all');
      }
    );
  }

  ngOnDestroy(): void {
    this.listTypeSubscription?.unsubscribe();
  }

  /**
   * Called on status filter change.
   * @param { SupermindConsoleStatusFilterType } statusFilterValue - value changed to.
   * @returns { void }
   */
  public onStatusFilterChange(
    statusFilterValue: SupermindConsoleStatusFilterType
  ): void {
    this.statusFilterValue$.next(statusFilterValue);
    this.statusFilterChange.emit(
      this.getSupermindStatusFromFilterValue(statusFilterValue)
    );
  }

  /**
   * Get SupermindState from filter value.
   * @param { SupermindConsoleStatusFilterType } statusFilterValue - value changed to.
   * @returns { SupermindState } state of Supermind.
   */
  private getSupermindStatusFromFilterValue(
    statusFilterValue: SupermindConsoleStatusFilterType
  ): SupermindState {
    switch (statusFilterValue) {
      case 'all':
        return null;
      case 'pending':
        // PENDING is an interim state in processing - from the filtered
        // feed perspective, on selecting pending, we want to get CREATED.
        return SupermindState.CREATED;
      case 'accepted':
        return SupermindState.ACCEPTED;
      case 'revoked':
        return SupermindState.REVOKED;
      case 'rejected':
        return SupermindState.REJECTED;
      case 'failed':
        return SupermindState.FAILED;
      case 'failed_payment':
        return SupermindState.FAILED_PAYMENT;
      case 'expired':
        return SupermindState.EXPIRED;
    }
  }
}
