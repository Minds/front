import { Component, HostBinding } from '@angular/core';
import { FeaturesService } from '../../../services/features.service';

/**
 * Discovery top feed component.
 * Presents a default recommendations feed with discovery tabs.
 */
@Component({
  selector: 'm-discovery__top',
  styleUrls: ['top.component.ng.scss'],
  template: `
    <m-discovery__tabs></m-discovery__tabs>
    <m-defaultFeed></m-defaultFeed>
  `,
})
export class DiscoveryTopComponent {
  constructor(public featuresService: FeaturesService) {}
  // ojm connect to feature flag
  @HostBinding('class.m-discovery__top--activityV2')
  get activityV2Feature(): boolean {
    return true;
  }
}
