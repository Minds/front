import { EventEmitter, Injector } from '@angular/core';
import { Observable } from 'rxjs/Rx';

export class ScrollService {

  scroll;
  view: any;
  viewListener;
  viewEmitter: EventEmitter<any> = new EventEmitter();

  static _() {
    return new ScrollService();
  }

  constructor() {
    this.view = document.getElementsByTagName('body')[0];
    this.view.scrollTop = 0;
    this.scroll = Observable.fromEvent(window, 'scroll');
  }

  fire() {
    this.scroll.next({ top: this.view.scrollTop, height: this.view.clientHeight });
  }

  listen(callback: Function, debounce: number = 0, throttle: number = 0): any {
    if (debounce) {
      return this.scroll
        .debounceTime(debounce)
        .subscribe(callback);
    }
    if (throttle) {
      return this.scroll
        .throttleTime(throttle)
        .subscribe(callback);
    }
    return this.scroll
      .subscribe(callback);
  }

  unListen(subscription: any) {
    subscription.unsubscribe();
  }

  listenForView() {
    if (!this.viewListener) {
      this.viewListener = this.scroll.debounceTime(500).subscribe((e) => { this.viewEmitter.next(e); });
    }
    return this.viewEmitter;
  }

}
