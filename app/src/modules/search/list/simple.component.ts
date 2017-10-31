import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'm-search--simple-list',
  templateUrl: 'simple.component.html'
})
export class SearchSimpleListComponent {
  @Input() entities: any[] = [];
}
