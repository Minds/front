import { Directive, ElementRef } from 'angular2/core';

@Directive({
  selector: '[tooltip]',
  exportAs: 'tooltip',
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()'
  }
})
export class Tooltip {

  private _element: any;
  private timeout: any;
  shown: boolean = false;
  style: any = {};

  constructor(element: ElementRef) {
    this._element = element.nativeElement;
  }

  show() {
    let position = this.getFixedPosition(this._element);

    if (!position) {
      return;
    }

    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.shown = true;
      this.style = {
        top: position.top + position.height,
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

  // Internal

  private getFixedPosition(elem: any) {
    if (!elem.getClientRects().length) {
      // dettached DOM element
      return false;
    }

    let rect = elem.getBoundingClientRect(),
      result: any = {};

    if (typeof rect.top === 'undefined') {
      return false;
    }

    result.top = rect.top;
    result.right = window.innerWidth - rect.right;
    result.bottom = window.innerHeight - rect.bottom;
    result.left = rect.left;
    result.width = rect.width;
    result.height = rect.height;

    return result;
  }
}
