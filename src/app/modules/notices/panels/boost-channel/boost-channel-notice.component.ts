import { Component } from '@angular/core';
import { Session } from '../../../../services/session';
import { BoostModalLazyService } from '../../../boost/modal/boost-modal-lazy.service';

/**
 * Feed notice directing users to boost their channel.
 */
@Component({
  selector: 'm-feedNotice--boostChannel',
  templateUrl: 'boost-channel-notice.component.html',
})
export class BoostChannelNoticeComponent {
  constructor(
    private boostModal: BoostModalLazyService,
    private session: Session
  ) {}

  /**
   * Called on primary option click. Opens boost modal.
   * @param { MouseEvent } $event - click event.
   * @return { void }
   */
  public onPrimaryOptionClick($event: MouseEvent): void {
    this.boostModal.open(this.session.getLoggedInUser());
  }

  /**
   * Called on secondary option click. Opens boost marketing page in a new tab.
   * @param { MouseEvent } $event - click event.
   * @return { void }
   */
  public onSecondaryOptionClick($event: MouseEvent): void {
    window.open('/boost', '_blank');
  }
}
