import { Component, Input } from '@angular/core';

/**
 * Generic notice with projected title, projected description, icon and
 * projected button slots
 *
 * See it in empty feeds
 */
@Component({
  selector: 'm-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.ng.scss'],
})
export class NoticeComponent {
  /**
   * Optional id for material icon
   */
  @Input() iconId;
}
