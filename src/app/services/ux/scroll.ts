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

  constructor() {
    this.view = document.getElementsByTagName('body')[0];
    // this.view.scrollTop = 0;
    this.scroll = fromEvent(window, 'scroll');
  }

  listen(
    callback: (value: any) => any,
    debounce: number = 0,
    throttle: number = 0
  ): any {
    if (debounce) {
      return this.scroll.pipe(debounceTime(debounce)).subscribe(callback);
    }
    if (throttle) {
      return this.scroll.pipe(throttleTime(throttle)).subscribe(callback);
    }
    return this.scroll.subscribe(callback);
  }

  unListen(subscription: any) {
    subscription.unsubscribe();
  }

  listenForView() {
    if (!this.viewListener) {
      this.viewListener = this.scroll
        .pipe(debounceTime(100)) // wait 100ms before triggering
        .subscribe((e) => {
          this.viewEmitter.next(e);
        });
    }
    return this.viewEmitter;
  }

  isVisible(element: HTMLElement, topTolerance = 0): boolean {
    const vpTop = this.view.scrollTop;
    const vpBottom = vpTop + this.view.clientHeight;
    const vpHeight = vpBottom - vpTop;

    const elBounds = element.getBoundingClientRect();

    const elTop = elBounds.top - topTolerance;
    const elBottom = elTop + elBounds.height;

    // the part of the component (in pixels) that's ON the screen
    const vpEl = elTop - vpHeight;

    if (elBottom > 0 && vpEl < 0) {
      return true;
    }

    return false;
  }
}
