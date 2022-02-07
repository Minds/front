import { Component, Input } from '@angular/core';
import { FastFadeAnimation } from '../../../animations';

/**
 * Spinner with adjustable size
 */
@Component({
  selector: 'm-sizeableLoadingSpinner',
  templateUrl: 'sizeable-loading-spinner.component.html',
  styleUrls: ['./sizeable-loading-spinner.component.scss'],
  animations: [FastFadeAnimation],
})
export class SizeableLoadingSpinnerComponent {
  /**
   * Represents if the spinner should be displayed or not
   */
  @Input() inProgress = false;

  /**
   * Represents the width of the spinning animation
   */
  @Input() spinnerWidth = '';

  /**
   * Represents the height of the spinning animation
   */
  @Input() spinnerHeight = '';
}
