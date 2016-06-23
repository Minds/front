import { Component } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';

@Component({
  selector: 'minds-tooltip',
  inputs: [ 'properties' ],
  template: `
    <div class="m-bubble-popup"
    *ngIf="properties && properties.shown"
    [ngStyle]="properties.style">
      <ng-content></ng-content>
    </div>
  `,
  directives: [ CORE_DIRECTIVES ]
})
export class MindsTooltip {
  
}
