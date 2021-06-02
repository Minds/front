import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'm-modal',
  host: {
    '[hidden]': 'hidden',
  },
  inputs: ['open', 'allowClose'],
  outputs: ['closed'],
  template: `
    <div class="m-modal__wrapper">
      <div class="m-modal-bg" (click)="close($event)"></div>
      <div class="m-modal-container">
        <div class="mdl-card">
          <ng-content></ng-content>
          <div
            class="mdl-card__menu m-modal__close"
            (click)="close($event)"
            *ngIf="allowClose"
          >
            <i class="material-icons mdl-color-text--blue-grey-300">close</i>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['modal.component.ng.scss'],
})
export class Modal {
  allowClose: boolean = true;
  hidden: boolean = true;
  closed: EventEmitter<any> = new EventEmitter();

  set _hidden(value: boolean) {
    this.hidden = value;
  }

  set open(value: boolean) {
    this.hidden = !value;
  }

  close(event) {
    if (!this.allowClose) return;

    this.hidden = !this.hidden;
    this.closed.next(true);
    event.stopPropagation();
  }
}
