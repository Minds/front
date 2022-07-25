import { Component } from '@angular/core';
import { DismissalService } from '../../../../common/services/dismissal.service';

@Component({
  selector: 'm-discoveryTopHeader',
  templateUrl: './discovery-top-header.component.html',
})
export class DiscoveryTopHeaderComponent {
  constructor(private dismissal: DismissalService) {}

  /**
   * dismisses the component
   * @returns { void }
   */
  dismiss(): void {
    this.dismissal.dismiss('feed:discovery-fallback');
  }
}
