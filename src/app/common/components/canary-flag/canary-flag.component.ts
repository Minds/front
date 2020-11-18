import { Component, Input, OnInit } from '@angular/core';
import { Session } from '../../../services/session';

/**
 * Small canary flag to be shown to a user alongside a logo to show they are in Canary mode.
 */
@Component({
  selector: 'm-canaryFlag',
  template: `
    <span class="m-v3TopbarNav__canaryFlag" *ngIf="isCanaryMode">Canary</span>
  `,
  styleUrls: ['./canary-flag.component.ng.scss'],
})
export class CanaryFlagComponent {
  constructor(private session: Session) {}

  get isCanaryMode(): boolean {
    return this.session.getLoggedInUser().canary;
  }
}
