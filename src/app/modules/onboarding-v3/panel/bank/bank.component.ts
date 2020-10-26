import { Component, Input } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { WalletV2Service } from '../../../wallet/v2/wallet-v2.service';

@Component({
  selector: 'm-onboardingV3__bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.ng.scss'],
  providers: [WalletV2Service],
})
export class OnboardingV3BankComponent {
  @Input() nextClicked$: BehaviorSubject<boolean>;
  constructor() {}
}
