import { Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'm-tooltip',
  templateUrl: 'tooltip.component.html',
  host: {
    '(mouseenter)': 'setHidden(false)',
    '(mouseleave)': 'setHidden(true)'
  }
})
export class TooltipComponent {
  @Input() icon;
  @Input() anchor;
  @Input() iconClass;
  @Input() useParentPosition: boolean = false;

  hidden: boolean = true;
  offsetTop: number = 0;

  constructor(private element: ElementRef) {

  }

  setHidden(value: boolean) {
    this.hidden = value;

    if (!this.hidden && this.useParentPosition) {
      const clientRect = this.element.nativeElement.parentElement.getBoundingClientRect();
      this.offsetTop = clientRect.top + clientRect.height - 8;
    }
  }
}
