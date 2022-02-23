import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'm-networkBridgeSwap',
  templateUrl: 'network-bridge-swap.component.html',
  styleUrls: [
    '../network-swap-bridge-common.ng.scss',
    './network-bridge-swap.ng.scss',
  ],
})
export class NetworkBridgeSwapModalComponent implements OnInit {
  ngOnInit(): void {}

  // Completion intent.
  onComplete: () => any = () => {};

  // Dismiss intent.
  onDismissIntent: () => void = () => {};

  /**
   * Sets modal options.
   * @param { Function } onDismissIntent - set dismiss intent callback.
   * @param { Function } onSaveIntent - set save intent callback.
   * @param { BoostableEntity } entity - set entity that is the subject of the boost.
   */
  setModalData({ onDismissIntent, onSaveIntent, entity }) {
    this.onDismissIntent = onDismissIntent || (() => {});
  }
}
