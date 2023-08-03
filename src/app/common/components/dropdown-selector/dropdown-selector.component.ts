import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Session } from '../../../services/session';
import { Filter, Option } from '../../../interfaces/dashboard';

export type DropdownSelectorSelection = {
  option: Option;
  filterId: string;
};

/**
 * A specialized dropdown menu whose trigger component displays the currently selected item
 *
 * See it in the filters of analytics charts
 */
@Component({
  selector: 'm-dropdownSelector',
  templateUrl: './dropdown-selector.component.html',
})
export class DropdownSelectorComponent implements OnInit {
  @Input() filter: Filter;
  @Input() dropUp: boolean = false;
  @Input() showLabel: boolean = true;
  @Input() inlineLabel = false;
  @Output() selectionMade: EventEmitter<
    DropdownSelectorSelection
  > = new EventEmitter<DropdownSelectorSelection>();

  expanded = false;

  options: Array<any> = [];
  @Input() selectedOption: Option;
  constructor(public session: Session) {}

  ngOnInit() {
    this.selectedOption = this.filter.options[0];
    if (this.filter.options.find(opt => opt.selected === true)) {
      this.selectedOption = this.filter.options.find(
        opt => opt.selected === true
      );
    }
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

  close(): void {
    this.expanded = false;
  }
}
