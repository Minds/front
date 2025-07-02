import { Component, Input } from '@angular/core';

@Component({
  selector: 'm-tooltip',
  template: '<ng-content></ng-content>',
  standalone: false,
})
export class TooltipComponentMock {
  @Input() icon;
  @Input() iconClass;
  @Input() iconSrc;
}
