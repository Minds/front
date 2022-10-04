import { Component, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  SupermindConsoleStatusFilterType,
  SupermindState,
} from '../../../supermind.types';

/**
 * Filter bar component for Supermind console.
 */
@Component({
  selector: 'm-supermind__filterBar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.ng.scss'],
})
export class SupermindConsoleFilterBarComponent {
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
  > = new BehaviorSubject<SupermindConsoleStatusFilterType>('all');

  // fired on filter state change.
  @Output() statusFilterChange: EventEmitter<SupermindState> = new EventEmitter<
    SupermindState
  >();

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
   * @returns { void }
   */
  public getSupermindStatusFromFilterValue(
    statusFilterValue: SupermindConsoleStatusFilterType
  ): SupermindState {
    switch (statusFilterValue) {
      case 'all':
        return null;
      case 'pending':
        // Pending is an interim state in processing - from the filtered feed
        // perspective, on selecting pending, we want to created.
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
