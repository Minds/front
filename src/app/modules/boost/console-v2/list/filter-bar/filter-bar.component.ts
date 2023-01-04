import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  BoostConsoleLocationFilterType,
  BoostConsoleStateFilterType,
  BoostState,
} from '../../../boost.types';
import { BoostConsoleService } from '../../services/console.service';

/**
 * Filter bar component for Boost console.
 */
@Component({
  selector: 'm-boostConsole__filterBar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.ng.scss'],
})
export class BoostConsoleFilterBarComponent implements OnInit, OnDestroy {
  // state filter type values.
  readonly stateFilterTypes: BoostConsoleStateFilterType[] = [
    'all',
    'pending',
    'approved',
    'completed',
    'rejected',
  ];

  // state filter values.
  public readonly stateFilterValue$: BehaviorSubject<
    BoostConsoleStateFilterType
  > = new BehaviorSubject<BoostConsoleStateFilterType>(null);

  private locationFilterSubscription: Subscription;

  // fired on filter state change.
  @Output() stateFilterChange: EventEmitter<BoostState> = new EventEmitter<
    BoostState
  >();

  constructor(private service: BoostConsoleService) {}

  ngOnInit(): void {
    // set default state filter value on location type change.
    this.locationFilterSubscription = this.service.locationFilterValue$.subscribe(
      (locationFilter: BoostConsoleLocationFilterType): void => {
        this.onStateFilterChange('all');
      }
    );
  }

  ngOnDestroy(): void {
    this.locationFilterSubscription?.unsubscribe();
  }

  /**
   * Called on state filter change.
   * @param { BoostConsoleStateFilterType } stateFilterValue - value changed to.
   * @returns { void }
   */
  public onStateFilterChange(
    stateFilterValue: BoostConsoleStateFilterType
  ): void {
    this.stateFilterValue$.next(stateFilterValue);
    this.stateFilterChange.emit(
      this.getBoostStateFromFilterValue(stateFilterValue)
    );
  }

  /**
   * Get BoostState from filter value.
   * @param { BoostConsoleStateFilterType } stateFilterValue - value changed to.
   * @returns { BoostState } state of Boost.
   */
  private getBoostStateFromFilterValue(
    stateFilterValue: BoostConsoleStateFilterType
  ): BoostState {
    switch (stateFilterValue) {
      case 'all':
        return null;
      case 'pending':
        return BoostState.PENDING;
      case 'approved':
        return BoostState.APPROVED;
      // ojm what is BoostState.COMPLETED? do not use 'approved' below
      case 'completed':
        return BoostState.APPROVED;
      case 'rejected':
        return BoostState.REJECTED;
    }
  }
}
