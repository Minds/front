import { Component } from '@angular/core';
/**
 * Polygon Historic component, giving users the ability to swap between networks.
 */
@Component({
  selector: 'm-wallet__polygon-historic',
  templateUrl: 'historic.component.html',
  styleUrls: ['./historic.component.ng.scss'],
})
export class WalletPolygonHistoricComponent {
  pending = true;

  /**
   * Changes active tab.
   * @returns { void }
   */
  async changeTab() {
    this.pending = !this.pending;
  }
}
