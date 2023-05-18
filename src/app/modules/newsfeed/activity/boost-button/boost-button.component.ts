import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Boost button used in activity toolbar.
 * Displayed for owners only (non-owners see the 'tip' button instead)
 */
@Component({
  selector: 'm-activity__boostButton',
  templateUrl: 'boost-button.html',
  styleUrls: ['./boost-button.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityBoostButtonComponent {}
