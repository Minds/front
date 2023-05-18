import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { FeedService } from '../../../modules/channels/v2/feed/feed.service';
import { DateRangeModalService } from '../date-range-modal/date-range-modal.service';

/**
 * Feed filter options
 */
export type FeedFilterOption = 'type' | 'dateRange';

/**
 * Feed filter sort
 * TODO: Implement in component, used externally for now
 */
export type FeedFilterSort = 'latest' | 'top' | 'hot' | 'scheduled';

/**
 * Feed filter type values
 */
export type FeedFilterType = 'activities' | 'images' | 'videos' | 'blogs';

/**
 * Feed filter date range values
 */
export type FeedFilterDateRangeType = 'all' | 'custom';

/**
 * Feed filter label/value set
 */
export interface LabelValue<T> {
  label?: string;
  value: T;
  hidden?: boolean;
  menuLabel?: string;
}

/**
 * Feed filter date range object (in seconds)
 */
export interface FeedFilterDateRange {
  fromDate: number | null;
  toDate: number | null;
}
/**
 * Feed filter component
 */
@Component({
  selector: 'm-feedFilter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'feed-filter.component.html',
  styleUrls: ['feed-filter.component.ng.scss'],
})
export class FeedFilterComponent implements OnInit {
  subscriptions: Array<Subscription>;

  /**
   * Displayed options
   */
  @Input() options: Array<FeedFilterOption> = ['type', 'dateRange'];

  /**
   * Current type
   */
  @Input() type: FeedFilterType;

  /**
   * Current date range
   */
  @Input() dateRangeType: FeedFilterDateRangeType = 'all';

  /**
   * Change current type
   */
  @Output('typeChange') typeChangeEmitter: EventEmitter<
    FeedFilterType
  > = new EventEmitter<FeedFilterType>();

  /**
   * Sorts
   * TODO: Implement in component, used externally for now
   */
  readonly sorts: Array<LabelValue<FeedFilterSort>> = [
    { label: 'Hot', value: 'hot' },
    { label: 'Top', value: 'top' },
    { label: 'Latest', value: 'latest' },
    { label: 'Scheduled', value: 'scheduled', hidden: true },
  ];

  /**
   * Types
   */
  readonly types: Array<LabelValue<FeedFilterType>> = [
    { label: 'All', value: 'activities' },
    { label: 'Images', value: 'images' },
    { label: 'Videos', value: 'videos' },
    { label: 'Blogs', value: 'blogs' },
  ];

  /**
   * Date range types
   */
  readonly dateRangeTypes: Array<LabelValue<FeedFilterDateRangeType>> = [
    { label: 'All', value: 'all', menuLabel: 'All time' },
    { label: null, value: 'custom', menuLabel: 'Date range' },
  ];

  constructor(
    public service: FeedService,
    protected dateRangeModal: DateRangeModalService,
    protected injector: Injector
  ) {}

  ngOnInit(): void {
    this.subscriptions = [
      this.service.dateRangeEnabled$.subscribe(dateRangeEnabled => {
        this.dateRangeType = dateRangeEnabled ? 'custom' : 'all';
      }),
    ];
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onDateRangeChange(dateRangeType: FeedFilterDateRangeType): void {
    if (dateRangeType === 'all') {
      this.service.dateRange$.next({
        fromDate: null,
        toDate: null,
      });
    } else {
      this.openDateRangeModal();
    }
  }

  /**
   * Opens date range modal
   */
  async openDateRangeModal(): Promise<void> {
    const dateRange: FeedFilterDateRange = await this.dateRangeModal.pick(
      this.injector
    );

    if (dateRange) {
      this.service.dateRange$.next(dateRange);
    }
  }

  get typeLabel() {
    return this.types.find(typeObj => typeObj.value === this.type).label;
  }

  get dateRangeLabel() {
    return this.dateRangeTypes.find(
      dateRangeEntry => dateRangeEntry.value === this.dateRangeType
    ).label;
  }
}
