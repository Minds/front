import { Directive, EventEmitter, ElementRef } from 'angular2/core';

@Directive({
  selector: '[emoji]',
  outputs: [ 'emoji' ],
  exportAs: 'emoji',
  host: {
    '(click)': 'toggle()'
  }
})
export class Emoji {
  emoji: EventEmitter<any>  = new EventEmitter();
  shown: boolean = false;
  style: any = {};
  private _element: any;

  constructor(element: ElementRef) {
    this._element = element.nativeElement;
  }

  toggle() {
    if (this.shown) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    let position = this.getFixedPosition(this._element);

    if (!position) {
      return;
    }

    this.shown = true;
    this.style = {
      bottom: position.bottom + position.height,
      right: position.right
    };
  }

  close() {
    this.shown = false;
  }

  ngOnDestroy() {
    this.close();
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
