import { EventEmitter } from 'angular2/core';

export class TooltipService {
  shown: boolean = false;
  anchor: any = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 0,
    height: 0
  };
  text: string = '';

  show(text: string, anchor: any) {
    if (!anchor) {
      return;
    }

    this.shown = true;
    this.text = text;
    this.anchor = anchor;
  }

  hide() {
    this.shown = false;
    this.text = '';
  }
}
