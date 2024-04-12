import { EventEmitter } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';

export type ScrollSubscription = {
  element: any;
  scrollEvent?: Observable<Event>;
  viewListener?: any;
  subscriptions: Array<Subscription>;
};

export class GlobalScrollService {
  scroll: Observable<Event>;
  subscriptions: Array<ScrollSubscription> = [];

  static _() {
    return new GlobalScrollService();
  }

  constructor() {}

  listen(
    scrollSource,
    callback: (subscription: any, event: any) => any,
    debounce: number = 0,
    throttle: number = 0
  ): [ScrollSubscription, Subscription] {
    const subscription = this.setScrollSource(scrollSource);
    let eventSubscription;

    if (debounce) {
      eventSubscription = subscription.scrollEvent
        .pipe(debounceTime(debounce))
        .subscribe((e) => {
          callback(subscription, e);
        });
    } else if (throttle) {
      eventSubscription = subscription.scrollEvent
        .pipe(throttleTime(throttle))
        .subscribe((e) => callback(subscription, e));
    } else {
      eventSubscription = subscription.scrollEvent.subscribe((e) =>
        callback(subscription, e)
      );
    }

    subscription.subscriptions.push(eventSubscription);

    return [subscription, eventSubscription];
  }

  unListen(scrollSubscription: ScrollSubscription, subscription: Subscription) {
    const subscriptionIndex = scrollSubscription.subscriptions.findIndex(
      (item) => item === subscription
    );
    if (subscriptionIndex != -1) {
      scrollSubscription.subscriptions.splice(subscriptionIndex, 1);
    }

    subscription.unsubscribe();

    if (scrollSubscription.subscriptions.length === 0) {
      const i = this.subscriptions.findIndex(
        (item) => item === scrollSubscription
      );
      this.subscriptions.splice(i, 1);
    }
  }

  listenForView(scrollSource) {
    const subscription = this.setScrollSource(scrollSource);

    const viewEmitter: EventEmitter<any> = new EventEmitter<any>();
    if (!subscription.viewListener) {
      subscription.viewListener = subscription.scrollEvent
        .pipe(debounceTime(30)) // wait 30ms before triggering
        .subscribe((e) => {
          viewEmitter.next(e);
        });
    }
    return viewEmitter;
  }

  private setScrollSource(scrollSource) {
    let subscription: ScrollSubscription = this.subscriptions.find(
      (item) => item.element === scrollSource
    );

    if (subscription) {
      return subscription;
    }

    scrollSource.scrollTop = 0;
    subscription = {
      element: scrollSource,
      scrollEvent: fromEvent(scrollSource, 'scroll'),
      subscriptions: [],
    };

    this.subscriptions.push(subscription);

    return subscription;
  }
}
