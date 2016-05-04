import { Directive,  EventEmitter, ElementRef, ChangeDetectorRef } from 'angular2/core';
import { EmojiService } from '../services/emoji';

@Directive({
  selector: '[emoji]',
  inputs: ['_emojiTarget: emoji'],
  host: {
    '(click)': 'toggle()',
    '(keydown.esc)': 'closeAndFocus()'
  }
})
export class Emoji {
  _element: any;
  emojiTarget: any = null;
  selected: EventEmitter<any> = new EventEmitter();

  constructor(element: ElementRef, public service: EmojiService, private ref: ChangeDetectorRef) {
    this._element = element.nativeElement;

    this.selected.subscribe((character: string) => {
      this.insert(character);
    });
  }

  set _emojiTarget(value: any) {
    this.emojiTarget = value;
  }

  toggle() {
    if (this.service.shown) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (!this.emojiTarget) {
      return;
    }

    let pos = this.getFixedPosition(this._element);

    if (!pos) {
      return;
    }

    this.service.open(this.selected, pos);
  }

  closeAndFocus() {
    this.close();

    if (this.emojiTarget) {
      this.emojiTarget.focus();
    }
  }

  close() {
    this.service.close();
  }

  insert(character: string) {
    setTimeout(() => {
      this.emojiTarget.value = (this.emojiTarget.value || '') + character;
      this.ref.detectChanges();
    });
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
