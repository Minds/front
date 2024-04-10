import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router, NavigationEnd, ActivationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class PageLayoutService {
  routerSubscription: Subscription;

  hasRightPane$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isFullWidth$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  hasTopbarBorder$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  hasTopbarBackground$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  // prevents layout reset on NavigationEnd event.
  private preventLayoutReset: boolean = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {
    this.routerSubscription = this.router.events
      .pipe(
        filter(
          (e) => e instanceof NavigationEnd || e instanceof ActivationStart
        )
      )
      .subscribe((event: NavigationEnd | ActivationStart) => {
        // in ActivationStart event, check for preventLayoutReset in route data.
        if (event instanceof ActivationStart) {
          this.preventLayoutReset =
            event.snapshot.data.preventLayoutReset ?? false;
          return;
        }
        // wait till NavigationEnd to call reset, incase of url / state changes.
        if (!this.preventLayoutReset && !isPlatformServer(this.platformId)) {
          this.reset();
        }
      });
  }

  /**
   * Forces to use full width
   * @return void
   */
  useFullWidth(): void {
    // if we are preventing layout resets - do not use timeouts.
    if (this.preventLayoutReset || isPlatformServer(this.platformId)) {
      this.isFullWidth$.next(true);
      return;
    }
    setTimeout(() => this.isFullWidth$.next(true));
  }

  cancelFullWidth(): void {
    if (this.preventLayoutReset || isPlatformServer(this.platformId)) {
      this.isFullWidth$.next(false);
      return;
    }
    setTimeout(() => this.isFullWidth$.next(false));
  }

  useTopbarBorder(): void {
    if (this.preventLayoutReset || isPlatformServer(this.platformId)) {
      this.hasTopbarBorder$.next(true);
      return;
    }
    setTimeout(() => this.hasTopbarBorder$.next(true));
  }

  removeTopbarBorder(): void {
    if (this.preventLayoutReset || isPlatformServer(this.platformId)) {
      this.hasTopbarBorder$.next(false);
      return;
    }
    setTimeout(() => this.hasTopbarBorder$.next(false));
  }

  useTopbarBackground(): void {
    if (this.preventLayoutReset || isPlatformServer(this.platformId)) {
      this.hasTopbarBackground$.next(true);
      return;
    }
    setTimeout(() => this.hasTopbarBackground$.next(true));
  }

  removeTopbarBackground(): void {
    if (this.preventLayoutReset || isPlatformServer(this.platformId)) {
      this.hasTopbarBackground$.next(false);
      return;
    }
    setTimeout(() => this.hasTopbarBackground$.next(false));
  }

  reset(): void {
    this.preventLayoutReset = false;
    this.isFullWidth$.next(false);
    this.hasTopbarBorder$.next(true);
    this.hasTopbarBackground$.next(true);
  }
}
