import { Component, OnInit } from '@angular/core';
import { GiftCardPurchaseExperimentService } from '../../../experiments/sub-services/gift-card-purchase-experiment.service';

/**
 * Base component for wallet pages that relate to credits
 */
@Component({
  selector: 'm-walletV2__credits',
  templateUrl: './credits.component.html',
})
export class WalletV2CreditsComponent implements OnInit {
  // whether purchase feature is active.
  public isPurchaseFeatureActive: boolean = false;

  constructor(private purchaseExperiment: GiftCardPurchaseExperimentService) {}

  ngOnInit(): void {
    this.isPurchaseFeatureActive = this.purchaseExperiment.isActive();
  }
}
