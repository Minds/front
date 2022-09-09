import { Component } from '@angular/core';

/**
 * Chip badge component used initially as the Supermind badge.
 * Provides a gradient background around the ng-content in a chip badge.
 */
@Component({
  selector: 'm-chipBadge',
  template: '<ng-content></ng-content>',
  styleUrls: ['./chip-badge.component.ng.scss'],
})
export class ChipBadgeComponent {}
