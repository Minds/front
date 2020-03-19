import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable()
export class PageLayoutService {
  routerSubscription: Subscription;

  hasRightPane$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isFullWidth$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  hasTopbarBorder$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  hasTopbarBackground$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(private router: Router) {
    this.routerSubscription = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(data => {
        this.reset();
      });
  }

  /**
   * Forces to use full width
   * @return void
   */
  useFullWidth(): void {
    setTimeout(() => this.isFullWidth$.next(true));
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
      this.isFullWidth$.next(false);
      this.hasTopbarBorder$.next(true);
      this.hasTopbarBackground$.next(true);
    });
  }
}
