import { Component, Input } from '@angular/core';
import { AffiliatesShareModalService } from '../../services/share-modal.service';
import { AffiliatesEarnMethod } from '../../types/affiliates.types';

/**
 * Description of how the affiliates program works
 */
@Component({
  selector: 'm-affiliates__description',
  templateUrl: 'description.component.html',
  styleUrls: ['description.component.ng.scss'],
})
export class AffiliatesDescriptionComponent {
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
  async openShareModal(earnMethod: AffiliatesEarnMethod): Promise<void> {
    const opts = {
      referrerUsername: this.referrerUsername,
      earnMethod: earnMethod,
    };

    this.affiliatesShareModalService.open(opts);
  }
}
