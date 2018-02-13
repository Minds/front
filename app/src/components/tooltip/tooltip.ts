import { Component, Input } from '@angular/core';

@Component({
  selector: 'minds-tooltip',
  inputs: [ 'properties' ],
  template: `
    <div class="m-bubble-popup"
    *ngIf="properties && properties.shown"
    [ngStyle]="properties.style">
      <ng-content></ng-content>
    </div>
  `
})
export class MindsTooltip {
  @Input() properties: any = {};
}
