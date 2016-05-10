import { Directive,  EventEmitter, ElementRef, ChangeDetectorRef } from 'angular2/core';
import { EmojiService } from '../services/emoji';

@Directive({
  selector: '[emoji]',
  outputs: [ 'emoji' ],
  host: {
    '(click)': 'toggle()'
  }
})
export class Emoji {
  emoji: EventEmitter<any>  = new EventEmitter();
  _element: any;
  _passthru: EventEmitter<any> = new EventEmitter();

  constructor(element: ElementRef, public service: EmojiService, private ref: ChangeDetectorRef) {
    this._element = element.nativeElement;

    this._passthru.subscribe((character: string) => {
      this.emoji.next({
        character
      });
    });
  }

  toggle() {
    if (this.service.shown) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    let pos = this.getFixedPosition(this._element);

    if (!pos) {
      return;
    }

    this.service.open(this._passthru, pos);
  }

  close() {
    this.service.close();
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
