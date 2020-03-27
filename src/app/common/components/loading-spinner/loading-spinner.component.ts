import { Component, Input } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  keyframes,
  state,
} from '@angular/animations';

@Component({
  selector: 'm-loadingSpinner',
  templateUrl: './loading-spinner.component.html',
  animations: [
    trigger('fastFade', [
      transition(':enter', [
        animate(
          '600ms',
          keyframes([
            style({ opacity: 0, transform: 'translateY(-100px)' }),
            style({ opacity: 1, transform: 'translateY(8px)' }),
            style({ transform: 'translateY(-8px)' }),
            style({ transform: 'translateY(0)' }),
          ])
        ),
      ]),
      transition(':leave', [
        animate(
          '1s',
          keyframes([
            style({ transform: 'translateY(0)', opacity: 1 }),
            style({ transform: 'translateY(2px)' }),
            style({ transform: 'translateY(-8px)' }),
            style({ transform: 'translateY(8px)' }),
            style({ transform: 'translateY(-100px)', opacity: 0 }),
          ])
        ),
      ]),
    ]),
  ],
})
export class LoadingSpinnerComponent {
  @Input() inProgress = false;
}
