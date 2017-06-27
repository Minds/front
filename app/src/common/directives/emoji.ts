import { Directive, EventEmitter, ElementRef } from '@angular/core';
import { AnchorPosition } from '../../services/ux/anchor-position';

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
    let position = AnchorPosition.getFixed(this._element, [ 'right', 'top' ]);

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
  }

  close() {
    this.shown = false;
  }

  ngOnDestroy() {
    this.close();
  }
}
