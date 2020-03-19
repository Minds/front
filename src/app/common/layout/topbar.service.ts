import { V2TopbarComponent } from './v2-topbar/v2-topbar.component';
import { V3TopbarComponent } from './v3-topbar/v3-topbar.component';
import { FeaturesService } from '../../services/features.service';
import { Injectable } from '@angular/core';

@Injectable()
export class TopbarService {
  private container: V2TopbarComponent | V3TopbarComponent;

  private useV3Topbar: boolean;

  static _(featuresService: FeaturesService) {
    return new TopbarService(featuresService);
  }

  constructor(private featuresService: FeaturesService) {
    this.useV3Topbar = this.featuresService.has('navigation');
  }

  setContainer(container: V2TopbarComponent | V3TopbarComponent) {
    this.container = container;

    return this;
  }

  toggleMarketingPages(
    value: boolean,
    showBottombar: boolean = true,
    forceBackground: boolean = true
  ): void {
    if (this.container) {
      if (this.useV3Topbar) {
        this.container.toggleMarketingPages(value, forceBackground);
      } else {
        this.container.toggleMarketingPages(
          value,
          showBottombar,
          forceBackground
        );
      }
    }
  }

  toggleVisibility(visible: boolean): void {
    if (this.container) {
      if (this.useV3Topbar) {
        this.container.toggleVisibility(visible);
      } else {
        this.container.toggleVisibility(visible);
      }
    }
  }
}
