import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  //   moduleId: module.id,
  selector: 'm-governance--filter-selector',
  templateUrl: 'filter-selector.component.html',
})
export class GovernanceFilterSelector {
  filter = '';

  @Output() filterBy = new EventEmitter();

  constructor() {}

  selectCategory(id: string) {
    this.filter = id;
    this.filterBy.emit(id);
  }
}
