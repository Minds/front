import { Directive,  ElementRef } from 'angular2/core';
import { TooltipService } from '../services/tooltip';

@Directive({
  selector: '[tooltip]',
  inputs: ['tooltip'],
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()'
  }
})
export class Tooltip {

  _element: any;
  tooltip: string = '';
  private timeout:any;

  constructor(element: ElementRef, public service: TooltipService) {
    this._element = element.nativeElement;
  }

  show() {
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.service.show(this.tooltip, this.getFixedPosition(this._element));
    }, 1000);
  }

  hide() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    
    this.service.hide();
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
