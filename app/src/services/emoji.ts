import { EventEmitter } from 'angular2/core';

export class EmojiService {
  private shown: boolean = false;
  private selected: EventEmitter<any>;
  private anchor: any = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 0,
    height: 0
  };

  open(selected: EventEmitter<any>, anchor: any) {
    if (!anchor) {
      return;
    }

    this.shown = true;
    this.selected = selected;
    this.anchor = anchor;
  }

  close() {
    this.shown = false;
    this.selected = null;
  }

  select(character: string) {
    if (!this.selected) {
      return;
    }

    this.selected.emit(character);
  }
}
