import { Component } from '@angular/core';
import { DismissalService } from '../../../../common/services/dismissal.service';

@Component({
  selector: 'm-defaultFeedHeader',
  templateUrl: './default-feed-header.component.html',
})
export class DefaultFeedHeaderComponent {
  constructor(private dismissal: DismissalService) {}

  /**
   * dismisses the component
   * @returns { void }
   */
  dismiss(): void {
    this.dismissal.dismiss('feed:discovery-fallback');
  }
}
