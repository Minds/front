import { Component, HostBinding, Input } from '@angular/core';
import { FastFadeAnimation } from '../../../animations';

@Component({
  selector: 'm-sizeable-loading-spinner',
  templateUrl: 'sizeable-loading-spinner.component.html',
  styleUrls: ['./sizeable-loading-spinner.component.scss'],
  animations: [FastFadeAnimation],
})
export class SizeableLoadingSpinnerComponent {
  @Input() inProgress = false;
  @Input() spinnerWidth = '';
  @Input() spinnerHeight = '';

  @HostBinding('style.--spinner-width') styleSpinnerWidth: string;
  @HostBinding('style.--spinner-height') styleSpinnerHeight: string;
}
