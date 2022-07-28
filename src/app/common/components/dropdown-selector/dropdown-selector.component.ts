import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Session } from '../../../services/session';
import { Filter, Option } from '../../../interfaces/dashboard';

/**
 * A specialized dropdown menu whose trigger component displays the currently selected item
 *
 * See it in the filters of analytics charts
 */
@Component({
  selector: 'm-dropdownSelector',
  templateUrl: './dropdown-selector.component.html',
  styleUrls: ['./dropdown-selector.component.scss'],
})
export class DropdownSelectorComponent implements OnInit {
  @Input() filter: Filter;
  @Input() dropUp: boolean = false;
  @Input() showLabel: boolean = true;
  @Input() inlineLabel = false;
  @Output() selectionMade: EventEmitter<any> = new EventEmitter();

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
}
