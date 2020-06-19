import { Component, Input } from '@angular/core';

@Component({
  selector: 'm-groupProfile__info',
  templateUrl: 'info.component.html',
})
export class GroupInfoComponent {
  @Input() group: any;
  @Input() editing: boolean = false;
}
