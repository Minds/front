import { Component } from '@angular/core';
import { WalletV2Service } from '../../../wallet/components/wallet-v2.service';

@Component({
  selector: 'm-onboardingV3__bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.ng.scss'],
  providers: [WalletV2Service],
})
export class OnboardingV3BankComponent {
  constructor() {}
}
