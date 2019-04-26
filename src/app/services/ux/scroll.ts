import { EventEmitter } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';

export class ScrollService {

  scroll: Observable<Event>;
  view: any;
  viewListener;
  viewEmitter: EventEmitter<any> = new EventEmitter();

  static _() {
    return new ScrollService();
  }

  constructor() { }

  setScrollSource(scrollSource) {
    this.view = scrollSource;
    this.view.scrollTop = 0;
    this.scroll = fromEvent(scrollSource, 'scroll');
  }

  listen(callback: (value: any) => any, debounce: number = 0, throttle: number = 0): any {
    if (!this.scroll) {
      this.setScrollSource(document.getElementsByTagName('body')[0]);
    }
    if (debounce) {
      return this.scroll
        .pipe(debounceTime(debounce))
        .subscribe(callback);
    }
    if (throttle) {
      return this.scroll
        .pipe(throttleTime(throttle))
        .subscribe(callback);
    }
    return this.scroll
      .subscribe(callback);
  }

  unListen(subscription: any) {
    subscription.unsubscribe();
  }

  listenForView() {
    if (!this.scroll) {
      this.setScrollSource(document.getElementsByTagName('body')[0]);
    }
    if (!this.viewListener) {
      this.viewListener = this.scroll
        .pipe(debounceTime(500))
        .subscribe((e) => { this.viewEmitter.next(e); });
    }
    return this.viewEmitter;
  }

}
