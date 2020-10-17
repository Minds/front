import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { IProviderUserOptions } from '@dorgtech/web3-wallet-connector';

@Component({
  selector: 'm-web3-modal',
  templateUrl: 'web3-modal.component.html',
})
export class Web3ModalComponent {
  providersSubscription: Subscription = undefined;
  providers: IProviderUserOptions[] = [];

  onDismissIntent: () => void = () => {};

  set opts({ onDismissIntent, providers }) {
    this.onDismissIntent = onDismissIntent || (() => {});
    this.providers = providers;
  }

  constructor() {}
}
