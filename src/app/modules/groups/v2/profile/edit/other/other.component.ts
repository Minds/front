import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GroupEditService } from '../edit.service';

@Component({
  selector: 'm-groupEdit__other',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'other.component.html',
})
export class GroupEditOtherComponent {
  /**
   * Constructor
   * @param service
   */
  constructor(public service: GroupEditService) {}
}
