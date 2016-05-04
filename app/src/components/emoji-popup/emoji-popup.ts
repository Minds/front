import { Component } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

import { EmojiService } from '../../services/emoji';
import { EmojiList } from '../../services/emoji-list';

@Component({
  selector: 'm-emoji-popup',
  template: `
    <div class="m-bubble-popup mdl-shadow--4dp"
    *ngIf="emojiService.shown"
    [style.bottom]="emojiService.anchor.bottom + emojiService.anchor.height"
    [style.right]="emojiService.anchor.right"
    >
      <div class="m-emoji-selector-title">
        Emoji
        <i class="material-icons m-emoji-selector-close"
        (click)="hide()"
        >close</i>
      </div>
      <div class="m-emoji-selector-list">
        <span *ngFor="#emoji of emojis"
        tabindex="0"
        class="m-emoji"
        [title]="emoji.name"
        (click)="select(emoji.codePoint, $event)"
        (keydown.enter)="select(emoji.codePoint, $event)"
        (keydown.space)="select(emoji.codePoint, $event)"
        (keydown.esc)="hide()"
        >{{ represent(emoji.codePoint) }}</span>
      </div>
    </div>


    <!-- TODO: Use emoji pipe when displaying -->
  `,
  directives: [ CORE_DIRECTIVES ]
})
export class EmojiPopup {
  private emojis = EmojiList;

  constructor(public emojiService: EmojiService) {}

  hide() {
    if (!this.emojiService.shown) {
      return;
    }

    this.emojiService.close()
  }

  select(codePoint: number, $event: any) {
    if ($event) {
      $event.preventDefault();
    }

    this.emojiService.select(this.represent(codePoint));
  }

  represent(codePoint: number) {
    return this.fromCodePoint(codePoint);
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
