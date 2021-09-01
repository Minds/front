import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'm-governance--filter-type-selector',
  templateUrl: './filter-type-selector.component.html',
})
export class GovernanceFilterTypeSelector {
  filter = '';

  @Output() filterBy = new EventEmitter();

  constructor() {}

  selectCategory(id: string) {
    this.filter = id;
    this.filterBy.emit(id);
  }
}
