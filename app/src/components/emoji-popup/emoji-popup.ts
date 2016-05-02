import { Component } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

import { EmojiService } from '../../services/emoji';

// Initial list based on http://emojitracker.com/
export const EmojiList = [
  { codePoint: 128514, name: 'Joy' },
  { codePoint: 128155, name: 'Heart' }, // change me to red one (now: rendering issues on OSX)
  { codePoint: 128525, name: 'Heart Eyes' },
  { codePoint: 128530, name: 'Unamused' },
  { codePoint: 128522, name: 'Blush' },
  { codePoint: 128557, name: 'Crying' },
  { codePoint: 128536, name: 'Kissing Heart' },
  { codePoint: 128513, name: 'Grin' },
  { codePoint: 128515, name: 'Smile' },
  { codePoint: 128077, name: 'Thumbs Up' }
];

@Component({
  selector: 'm-emoji-popup',
  template: `
    <div class="m-bubble-popup mdl-shadow--8dp"
    *ngIf="emojiService.shown"
    [style.bottom]="emojiService.anchor.bottom + emojiService.anchor.height"
    [style.right]="emojiService.anchor.right"
    >
    <span *ngFor="#emoji of emojis"
    class="emoji"
    [title]="emoji.name"
    (click)="select(emoji.codePoint, $event)"
    >{{ fromCodePoint(emoji.codePoint) }}</span>
    </div>


    <!-- TODO: Use emoji pipe when displaying -->
  `,
  directives: [ CORE_DIRECTIVES ]
})
export class EmojiPopup {
  private emojis = EmojiList;

  constructor(public emojiService: EmojiService) {}

  hide() {
    this.emojiService.close()
  }

  select(codePoint: number) {
    this.emojiService.select(this.fromCodePoint(codePoint));
    this.hide();
  }

  // Internal

  private fromCodePoint(...args: any[]) {
    if (typeof String.fromCodePoint !== 'undefined') {
      return String.fromCodePoint.apply(String, args);
    }

    var chars = [], point, offset, units, i;
    for (i = 0; i < args.length; ++i) {
      point = args[i];
      offset = point - 0x10000;
      units = point > 0xFFFF ? [0xD800 + (offset >> 10), 0xDC00 + (offset & 0x3FF)] : [point];
      chars.push(String.fromCharCode.apply(null, units));
    }
    return chars.join("");
  }
}
