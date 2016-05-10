import { Component } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

import { TooltipService } from '../../services/tooltip';

@Component({
  selector: 'm-tooltip-popup',
  template: `
    <div class="m-bubble-popup mdl-shadow--4dp"
    *ngIf="tooltipService.shown"
    [style.bottom]="tooltipService.anchor.bottom + tooltipService.anchor.height"
    [style.right]="tooltipService.anchor.right"
    [innerHtml]="tooltipService.text"
    ></div>
  `,
  directives: [ CORE_DIRECTIVES ]
})
export class TooltipPopup {
  constructor(public tooltipService: TooltipService) {}

  hide() {
    if (!this.tooltipService.shown) {
      return;
    }

    this.tooltipService.hide()
  }
}
