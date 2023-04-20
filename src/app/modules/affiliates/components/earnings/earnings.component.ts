import { Component, Input } from '@angular/core';
import { AffiliatesEarnMethod } from '../../types/affiliates.types';
import { AffiliatesShareModalService } from '../../services/share-modal.service';
import { Router } from '@angular/router';

/**
 * Affiliate program earnings summary,
 * including total earnings, links to earn more,
 * link to earnings table
 */
@Component({
  selector: 'm-affiliates__earnings',
  templateUrl: 'earnings.component.html',
  styleUrls: ['earnings.component.ng.scss'],
})
export class AffiliatesEarningsComponent {
  /**
   * Username of the referrer (aka current username)
   */
  @Input() referrerUsername: string = '';

  /**
   * Amount user has earned through affiliate program
   */
  @Input() totalEarnings: number;

  constructor(
    private affiliatesShareModalService: AffiliatesShareModalService
  ) {}

  /**
   * Opens the affiliate share modal with invite links
   */
  async openShareModal(): Promise<void> {
    const earnMethod: AffiliatesEarnMethod = 'affiliate';

    const opts = {
      referrerUsername: this.referrerUsername,
      earnMethod: earnMethod,
    };

    this.affiliatesShareModalService.open(opts);
  }
}
