import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FeedService } from '../../../modules/channels/v2/feed/feed.service';
import { FeedFilterDateRange } from '../feed-filter/feed-filter.component';
import * as moment from 'moment';

export type DateRange = {};
/**
 * NO-OP
 */
const noOp = () => {};

/**
 * Modal that allows user to select a range of time
 * between 2 dates
 */
@Component({
  selector: 'm-dateRangeModal',
  templateUrl: './date-range-modal.component.html',
  styleUrls: ['./date-range-modal.component.ng.scss'],
})
export class DateRangeModalComponent implements OnInit, OnDestroy {
  defaultToDate;
  defaultFromDate;

  fromDate: number;
  toDate: number;

  maxDate = new Date();
  minDate = new Date(1348141290000); // @mark's creation date

  subscriptions: Array<Subscription>;

  /**
   *
   */
  onApplyIntent: (any: any) => void = noOp;

  /**
   *
   */
  onDismissIntent: () => void = noOp;

  constructor(public service: FeedService) {}

  ngOnInit(): void {
    this.defaultToDate = moment(Date.now())
      .endOf('day')
      .valueOf();

    this.defaultFromDate = moment(this.defaultToDate)
      .subtract(7, 'days')
      .startOf('day')
      .valueOf();

    this.toDate = this.defaultToDate;
    this.fromDate = this.defaultFromDate;

    this.subscriptions = [
      this.service.dateRange$.subscribe(dateRange => {
        if (!!dateRange.toDate && !!dateRange.fromDate) {
          this.fromDate = dateRange.fromDate;
          this.toDate = dateRange.toDate;
        }
      }),
    ];
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onFromDateChange(newDate): void {
    this.fromDate = moment(new Date(newDate))
      .startOf('day')
      .valueOf();
  }

  onToDateChange(newDate): void {
    this.toDate = moment(new Date(newDate))
      .endOf('day')
      .valueOf();
  }

  onApply(): void {
    this.onApplyIntent(this.dateRange);
    this.onDismissIntent();
  }

  /**
   * Calls DismissIntent.
   */
  onDismiss(): void {
    this.onDismissIntent();
  }

  @HostListener('window:keyup', ['$event'])
  keyup(e) {
    // enter key
    if (e.keyCode === 13) {
      this.onApply();
    }
    // esc key
    if (e.keyCode === 27) {
      this.onDismiss();
    }
  }

  get hasBackwardsRangeError(): Boolean {
    return this.fromDate > this.toDate;
  }

  get canApply(): Boolean {
    return !this.hasBackwardsRangeError;
  }

  get dateRange(): FeedFilterDateRange {
    return { fromDate: this.fromDate, toDate: this.toDate };
  }

  /**
   * Modal options
   * @param onApply
   * @param onDismissIntent
   */
  setModalData({ onApply, onDismiss }) {
    this.onApplyIntent = onApply || noOp;
    this.onDismissIntent = onDismiss || noOp;
  }
}
