import { Directive,  EventEmitter, ElementRef } from 'angular2/core';
import { EmojiService } from '../services/emoji';

@Directive({
  selector: '[emoji]',
  inputs: ['emoji', 'for'],
  host: {
    '(click)': 'open()',
    '(keydown.esc)': 'close()'
  }
})
export class Emoji {
  _element: any;
  for: any = null;
  selected: EventEmitter<any> = new EventEmitter();

  constructor(element: ElementRef, public service: EmojiService) {
    this._element = element.nativeElement;

    this.selected.subscribe((character: string) => {
      this.insert(character);
    });
  }

  open() {
    if (!this.for) {
      return;
    }

    let pos = this.getFixedPosition(this._element);

    if (!pos) {
      return;
    }

    this.service.open(this.selected, pos);
  }

  close() {
    this.service.close();
  }

  insert(character: string) {
    this.for.value = (this.for.value || '') + character;
    this.for.focus();
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
