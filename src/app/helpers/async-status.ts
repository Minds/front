import { BehaviorSubject, Subscription } from 'rxjs';

export default class AsyncStatus {
  protected ready: boolean = false;
  protected subject$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  isReady(): boolean {
    return this.ready;
  }

  done(): this {
    if (this.ready) {
      //      throw new Error('Already done');
    }

    this.ready = true;
    this.emit();

    return this;
  }

  emit(): this {
    this.subject$.next(this.ready);
    return this;
  }

  untilReady(): Promise<null> {
    if (this.isReady()) {
      return Promise.resolve(null);
    }

    return new Promise(resolve => {
      let subscription: Subscription;

      subscription = this.subject$.subscribe(() => {
        if (this.isReady()) {
          subscription.unsubscribe();
          resolve(null);
        }
      });
    });
  }

  static _() {
    return new AsyncStatus();
  }
}
