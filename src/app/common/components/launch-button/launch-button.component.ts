import { Component, EventEmitter, Output } from '@angular/core';

/**
 * Generic launch button - text with a launch icon to the right.
 */
@Component({
  selector: 'm-launchButton',
  template: `
    <div class="m-launchButton__container" (click)="click.next()">
      <i class="material-icons m-launchButton__icon">launch</i>
      <span class="m-launchButton__label"><ng-content></ng-content></span>
    </div>
  `,
  styleUrls: ['./launch-button.component.ng.scss'],
})
export class LaunchButtonComponent {
  /**
   * Outputs click events.
   */
  @Output() click: EventEmitter<void> = new EventEmitter<void>();
}
