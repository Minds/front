import { Component, Input } from '@angular/core';

@Component({
  selector: 'minds-error-box',
  inputs: ['errorString'],
  template: `
    <div
      class="mdl-card mdl-color--red-500 mdl-color-text--blue-grey-50  mdl-shadow--2dp"
      style="min-height:0;"
      *ngIf="errorString"
    >
      <div class="mdl-card__supporting-text mdl-color-text--blue-grey-50">
        {{ errorString }}
      </div>
    </div>
  `,
})
export class ErrorBox {
  @Input() errorString = '';
}
