import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'm-groups--filter-selector',
  templateUrl: 'filter-selector.component.html'
})
export class GroupsProfileFilterSelector {
  @Input() group: any;
  @Input() filter: string;
}
