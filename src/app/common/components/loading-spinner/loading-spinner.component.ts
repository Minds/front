import { Component, Input } from '@angular/core';
import { FastFadeAnimation } from '../../../animations';

/**
 * Displays an animated circle to signal that something is in progress
 */
@Component({
  selector: 'm-loadingSpinner',
  templateUrl: './loading-spinner.component.html',
  animations: [FastFadeAnimation],
})
export class LoadingSpinnerComponent {
  @Input() inProgress = false;
}
