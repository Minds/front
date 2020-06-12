import { Component } from '@angular/core';
import { GroupV2Service } from '../../services/group-v2.service';

@Component({
  selector: 'm-group__actions',
  templateUrl: 'actions.component.html',
})
export class GroupActionsComponent {
  /**
   * Constructor
   * @param service
   */
  constructor(public service: GroupV2Service) {}
}
