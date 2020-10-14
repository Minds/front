import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

/**
 * Feed filter options
 */
export type FeedFilterOption = 'type';

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
 * Feed filter label/value set
 */
interface LabelValue<T> {
  label: string;
  value: T;
  hidden?: boolean;
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
export class FeedFilterComponent {
  /**
   * Displayed options
   */
  @Input() options: Array<FeedFilterOption> = ['type'];

  /**
   * Current type
   */
  @Input() type: FeedFilterType;

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

  get typeLabel() {
    return this.types.find(typeObj => typeObj.value === this.type).label;
  }
}
