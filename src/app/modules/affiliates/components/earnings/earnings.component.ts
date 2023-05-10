import { Component, Input } from '@angular/core';
import { AffiliatesEarnMethod } from '../../types/affiliates.types';
import { AffiliatesShareModalService } from '../../services/share-modal.service';
import { Router } from '@angular/router';

/**
 * Affiliate program earnings summary,
 * including total earnings,
 * link to earnings table
 */
@Component({
  selector: 'm-affiliates__earnings',
  templateUrl: 'earnings.component.html',
  styleUrls: ['earnings.component.ng.scss'],
})
export class AffiliatesEarningsComponent {
  /**
   * Amount user has earned through affiliate program
   */
  @Input() totalEarnings: number;
}
