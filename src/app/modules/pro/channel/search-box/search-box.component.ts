import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

/**
 * Searchbox on topbar of pro sites
 */
@Component({
  selector: 'm-pro__searchBox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'search-box.component.html',
  styleUrls: ['search-box.component.ng.scss'],
})
export class SearchBoxComponent {
  @Input() query: string = '';

  @Output() queryChange: EventEmitter<string> = new EventEmitter<string>();

  @Output() onSearch: EventEmitter<void> = new EventEmitter<void>();

  @Output() onClearSearch: EventEmitter<void> = new EventEmitter<void>();
}
