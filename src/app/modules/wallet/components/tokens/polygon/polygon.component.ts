import { Component } from '@angular/core';
/**
 * Polygon component, giving users the ability to swap between networks.
 */
@Component({
  selector: 'm-wallet__polygon',
  templateUrl: 'polygon.component.html',
  styleUrls: ['./polygon.component.ng.scss'],
})
export class WalletPolygonComponent {
  bridge = false;

  /**
   * Changes active tab.
   * @returns { void }
   */
  async changeTab() {
    this.bridge = !this.bridge;
  }
}
