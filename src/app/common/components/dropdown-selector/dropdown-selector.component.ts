import {
  Component,
  OnInit,
  Input,
  Output,
  ChangeDetectionStrategy,
  EventEmitter,
} from '@angular/core';

import { Session } from '../../../services/session';
import { Filter, Option } from '../../../interfaces/dashboard';

@Component({
  selector: 'm-dropdownSelector',
  templateUrl: './dropdown-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownSelectorComponent implements OnInit {
  @Input() filter: Filter;
  @Input() dropUp: boolean = false;
  @Input() showLabel: boolean = true;
  @Output() selectionMade: EventEmitter<any> = new EventEmitter();

  expanded = false;

  options: Array<any> = [];
  selectedOption: Option;
  constructor(public session: Session) {}

  ngOnInit() {
    this.selectedOption =
      this.filter.options.find(option => option.selected === true) ||
      this.filter.options[0];
  }

  updateFilter(option: Option) {
    this.expanded = false;
    if ('available' in option && !option.available) {
      return;
    }
    this.selectedOption = option;

    this.selectionMade.emit({
      option: this.selectedOption,
      filterId: this.filter.id,
    });
  }
}
