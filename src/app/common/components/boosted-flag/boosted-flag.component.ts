import { Component, HostBinding, Input } from '@angular/core';

type BoostFlagSize = 'small' | 'medium';

/**
 * Shows "boosted post" with an upward arrow.
 */
@Component({
  selector: 'm-boostedFlag',
  templateUrl: './boosted-flag.component.html',
  styleUrls: ['./boosted-flag.component.ng.scss'],
})
export class BoostedFlagComponent {
  // text to display next to flag.
  @Input() text: string = 'Boosted Post';

  // supported sizes for flag.
  @Input() size: BoostFlagSize = 'medium';

  @HostBinding('class.m-boostFlag--medium') private get isMediumSize() {
    return this.size === 'medium';
  }

  @HostBinding('class.m-boostFlag--small') private get isSmallSize() {
    return this.size === 'small';
  }
}
