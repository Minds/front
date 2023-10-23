import { Component, OnInit } from '@angular/core';
import { Session } from '../../../services/session';
import { GiftCardPurchaseExperimentService } from '../../experiments/sub-services/gift-card-purchase-experiment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'm-topbarwrapper',
  templateUrl: 'topbar.component.html',
  styleUrls: ['topbar.component.ng.scss'],
})
export class TopbarWrapperComponent implements OnInit {
  public giftCardPurchaseExperimentIsActive: boolean = false;

  constructor(
    public session: Session,
    private router: Router,
    private giftCardPurchaseExperiment: GiftCardPurchaseExperimentService
  ) {}

  ngOnInit(): void {
    this.giftCardPurchaseExperimentIsActive = this.giftCardPurchaseExperiment.isActive();
  }

  /**
   * Handles click on gift icon.
   * @returns { void }
   */
  public onGiftIconClick(): void {
    this.router.navigate(['/wallet/credits/send']);
  }
}
