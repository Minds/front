import { BehaviorSubject, Subscription } from 'rxjs';

export default class AsyncLock {
  protected lockId: number = 0;
  protected locked: boolean = false;
  protected subject$: BehaviorSubject<number> = new BehaviorSubject(
    this.lockId
  );

  isLocked(): boolean {
    return this.locked;
  }

  lock(): this {
    if (this.locked) {
      throw new Error('Already locked');
    }

    this.locked = true;
    this.lockId++;

    return this;
  }

  unlock(): this {
    if (!this.locked) {
      throw new Error('Already unlocked');
    }

    this.locked = false;
    this.emit();

    return this;
  }

  emit(): this {
    this.subject$.next(this.lockId);
    return this;
  }

  untilUnlocked(): Promise<null> {
    if (!this.isLocked()) {
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      let subscription: Subscription;

      subscription = this.subject$.subscribe(() => {
        if (!this.isLocked()) {
          subscription.unsubscribe();
          resolve(null);
        }
      });
    });
  }
}
