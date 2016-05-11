import { Component } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

@Component({
  selector: 'minds-tooltip',
  inputs: [ 'properties' ],
  template: `
    <div class="m-bubble-popup"
    *ngIf="properties.shown"
    [ngStyle]="properties.style">
      <ng-content></ng-content>
    </div>
  `,
  directives: [ CORE_DIRECTIVES ]
})
export class MindsTooltip {
  
}
