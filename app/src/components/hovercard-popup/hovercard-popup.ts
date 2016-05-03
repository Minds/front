import { Component } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { CARDS } from '../../controllers/cards/cards';

import { HovercardService } from '../../services/hovercard';

@Component({
  selector: 'm-hovercard-popup',
  template: `
    <div class="minds-avatar-hovercard mdl-shadow--8dp"
    *ngIf="hovercardService.shown && hovercardService.data"
    [style.top]="hovercardService.anchor.top"
    [style.right]="hovercardService.anchor.right"
    [style.bottom]="hovercardService.anchor.bottom"
    [style.left]="hovercardService.anchor.left"
    (mouseenter)="hovercardService.stick(hovercardService.data.guid)"
    (mouseleave)="hide(hovercardService.data.guid)"
    >
      <minds-card-user [object]="hovercardService.data"></minds-card-user>
    </div>
  `,
  directives: [ CORE_DIRECTIVES, CARDS ]
})
export class HovercardPopup {
  constructor(public hovercardService: HovercardService) {}

  hide(guid: any) {
    this.hovercardService.unstick();

    setTimeout(() => {
      this.hovercardService.hide(guid);
    }, 250);
  }
}
