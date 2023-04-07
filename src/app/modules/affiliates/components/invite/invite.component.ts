import { Component, Input } from '@angular/core';
import { ModalService } from '../../../../services/ux/modal.service';
import { AffiliatesShareComponent } from '../share/share.component';
import { AffiliatesEarnMethod } from '../../types/affiliates.types';
import { AffiliatesShareModalService } from '../../services/share-modal.service';

/**
 * Description for inviting friends to Minds
 * via the affiliate program
 * and button to open the modal of links
 */
@Component({
  selector: 'm-affiliates__invite',
  templateUrl: 'invite.component.html',
  styleUrls: ['invite.component.ng.scss'],
})
export class AffiliatesInviteComponent {
  /**
   * Username of the referrer (aka current username)
   */
  @Input() referrerUsername: string = '';

  constructor(
    private affiliatesShareModalService: AffiliatesShareModalService
  ) {}

  /**
   * Opens the affiliate share modal with invite links
   */
  async openShareModal(): Promise<void> {
    const earnMethod: AffiliatesEarnMethod = 'referral';

    const opts = {
      referrerUsername: this.referrerUsername,
      earnMethod: earnMethod,
    };

    this.affiliatesShareModalService.open(opts);
  }
}
