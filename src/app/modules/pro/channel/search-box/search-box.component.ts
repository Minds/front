import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'm-pro__searchBox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'search-box.component.html',
})
export class SearchBoxComponent {
  @Input() query: string = '';

  @Output() queryChange: EventEmitter<string> = new EventEmitter<string>();

  @Output() onSearch: EventEmitter<void> = new EventEmitter<void>();

  @Output() onClearSearch: EventEmitter<void> = new EventEmitter<void>();
}
