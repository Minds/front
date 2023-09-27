import { Component, OnInit } from '@angular/core';
import { GiftCardPurchaseExperimentService } from '../../../../experiments/sub-services/gift-card-purchase-experiment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'm-walletV2__creditsSend',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.ng.scss'],
})
export class WalletV2CreditsSendComponent implements OnInit {
  constructor(
    private purchaseExperiment: GiftCardPurchaseExperimentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.purchaseExperiment.isActive()) {
      this.router.navigate(['/wallet/credits/history']);
    }
  }
}
