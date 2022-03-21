import { Component } from '@angular/core';

/**
 * Discovery top feed component.
 * Presents a default recommendations feed with discovery tabs.
 */
@Component({
  selector: 'm-discovery__top',
  styleUrls: ['top.component.ng.scss'],
  template: `
    <m-discovery__tabs></m-discovery__tabs>
    <m-defaultFeed location="discovery-feed"></m-defaultFeed>
  `,
})
export class DiscoveryTopComponent {}
