import { Injectable, ApplicationRef } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject, concat, interval } from 'rxjs';
import { filter, first } from 'rxjs/operators';

/**
 * A service that manges service worker and its update logic
 */
@Injectable({
  providedIn: 'root',
})
export class ServiceWorkerService {
  private newVersionAvailable$ = new BehaviorSubject<{
    hash: string;
    appData?: object;
  }>(undefined);
  private shouldRefreshOnNavigation = false;

  constructor(
    private swUpdate: SwUpdate,
    private router: Router,
    private appRef: ApplicationRef
  ) {}

  /**
   * starts watching for updates and refreshes the page on navigation events
   * @returns { Promise<void> }
   */
  async watchForUpdates() {
    const enabled = this.swUpdate.isEnabled;
    if (!enabled) {
      console.log('[ServiceWorker] not enabled');
      return null;
    }
    console.log('[ServiceWorker] watching for updates');

    // Listen for router events and refresh the app if we had an available update
    this.router.events
      .pipe(filter(e => e instanceof NavigationStart))
      .subscribe((data: NavigationStart) => {
        if (this.shouldRefreshOnNavigation) {
          window.location.pathname = data.url;
        }
      });

    // Allow the app to stabilize first, before starting
    // polling for updates with `interval()`.
    const appIsStable$ = this.appRef.isStable.pipe(
      first(isStable => isStable === true)
    );
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    // poll every 6 hours and check for updates
    everySixHoursOnceAppIsStable$.subscribe(() =>
      this.swUpdate.checkForUpdate()
    );

    this.swUpdate.versionUpdates.subscribe(event => {
      console.log('[ServiceWorker] Version update', event);
      switch (event.type) {
        case 'VERSION_DETECTED':
          break;
        case 'VERSION_INSTALLATION_FAILED':
          break;
        case 'VERSION_READY':
          this.newVersionAvailable$.next(event.latestVersion);
          this.shouldRefreshOnNavigation = true;
          break;
      }
    });
    this.swUpdate.unrecoverable.subscribe(event => {
      console.log('[ServiceWorker] unrecoverable', event);
      this.shouldRefreshOnNavigation = true;
    });
  }
}
