import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 *
 */
@Component({
  selector: 'm-wallet__skaleFaucet',
  templateUrl: 'faucet.component.html',
  styleUrls: ['./faucet.component.ng.scss'],
})
export class WalletSkaleFaucetComponent {
  public readonly balance$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(0);

  public claim(): void {}
}
