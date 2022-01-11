import { Component } from '@angular/core';

/**
 * Build your algorithm section that gives a user granular control
 * over their discovery algorithm.
 */
@Component({
  selector: 'm-discovery__buildYourAlgorithm',
  templateUrl: './build-your-algorithm.component.html',
  styleUrls: ['./build-your-algorithm.component.ng.scss'],
})
export class DiscoveryBuildYourAlgorithmComponent {
  // true if section is expanded.
  public expanded: boolean = false;

  /**
   * Called on header click - expands body.
   * @returns { void }
   */
  public headerClicked(): void {
    this.expanded = !this.expanded;
  }
}
