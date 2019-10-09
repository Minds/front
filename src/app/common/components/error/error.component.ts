import { Component, Input } from '@angular/core';

@Component({
  selector: 'm-error-box',
  template: `
    <div class="m-errorBox__container" *ngIf="message">
      <div class="m-errorBox__text">
        {{ message }}
      </div>
    </div>
  `,
})
export class ErrorBoxComponent {
  @Input() message: string;
}
