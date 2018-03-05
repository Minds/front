import { Directive, ElementRef } from '@angular/core';
import { AnchorPosition } from '../../services/ux/anchor-position';

@Directive({
  selector: '[tooltip]',
  exportAs: 'tooltip',
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()'
  }
})
export class Tooltip {

  shown: boolean = false;
  style: any = {};
  private _element: any;
  private timeout: any;

  constructor(element: ElementRef) {
    this._element = element.nativeElement;
  }

  show() {
    this.timeout = setTimeout(() => {
      this.timeout = null;

      let position = AnchorPosition.getFixed(this._element, ['left', 'bottom']);

      if (!position) {
        return;
      }

      this.shown = true;
      this.style = {
        top: position.top,
        right: position.right,
        bottom: position.bottom,
        left: position.left
      };
    }, 1000);
  }

  hide() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    this.shown = false;
  }
}
