import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router, NavigationEnd, ActivationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable()
export class PageLayoutService {
  routerSubscription: Subscription;

  hasRightPane$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isFullWidth$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  hasTopbarBorder$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  hasTopbarBackground$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  // prevents layout reset on NavigationEnd event.
  private preventLayoutReset: boolean = false;

  constructor(private router: Router) {
    this.routerSubscription = this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd || e instanceof ActivationStart)
      )
      .subscribe((event: NavigationEnd | ActivationStart) => {
        // in ActivationStart event, check for preventLayoutReset in route data.
        if (event instanceof ActivationStart) {
          this.preventLayoutReset =
            event.snapshot.data.preventLayoutReset ?? false;
          return;
        }
        // wait till NavigationEnd to call reset, incase of url / state changes.
        if (!this.preventLayoutReset) {
          this.reset();
        }
      });
  }

  /**
   * Forces to use full width
   * @return void
   */
  useFullWidth(): void {
    // if we are preventing layout resets -
    // do not use timeouts when setting to full width.
    if (this.preventLayoutReset) {
      this.isFullWidth$.next(true);
    }
    setTimeout(() => this.isFullWidth$.next(true));
  }

  cancelFullWidth(): void {
    setTimeout(() => this.isFullWidth$.next(false));
  }

  useTopbarBorder(): void {
    setTimeout(() => this.hasTopbarBorder$.next(true));
  }

  removeTopbarBorder(): void {
    setTimeout(() => this.hasTopbarBorder$.next(false));
  }

  useTopbarBackground(): void {
    setTimeout(() => this.hasTopbarBackground$.next(true));
  }

  removeTopbarBackground(): void {
    setTimeout(() => this.hasTopbarBackground$.next(false));
  }

  reset(): void {
    setTimeout(() => {
      this.preventLayoutReset = false;
      this.isFullWidth$.next(false);
      this.hasTopbarBorder$.next(true);
      this.hasTopbarBackground$.next(true);
    });
  }
}
