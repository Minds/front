import { Component, Input } from '@angular/core';
import { FastFadeAnimation } from '../../../animations';

@Component({
  selector: 'm-loadingSpinner',
  templateUrl: './loading-spinner.component.html',
  animations: [FastFadeAnimation],
})
export class LoadingSpinnerComponent {
  @Input() inProgress = false;
}
