import { ApplicationRef, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject, concat, interval } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../components/abstract-subscriber/abstract-subscriber.component';

/**
 * A service that manges service worker and its update logic
 */
@Injectable({
  providedIn: 'root',
})
export class ServiceWorkerService extends AbstractSubscriberComponent {
  private newVersionAvailable$ = new BehaviorSubject<{
    hash: string;
    appData?: object;
  }>(undefined);
  private shouldRefreshOnNavigation = false;

  constructor(
    private swUpdate: SwUpdate,
    private router: Router,
    private appRef: ApplicationRef
  ) {
    super();
  }

  /**
   * starts watching for updates and refreshes the page on navigation events
   * @returns { Promise<void> }
   */
  async watchForUpdates(): Promise<void> {
    const enabled = this.swUpdate.isEnabled;
    if (!enabled) {
      console.log('[ServiceWorker] not enabled');
      return null;
    }
    console.log('[ServiceWorker] watching for updates');

    // Allow the app to stabilize first, before starting
    // polling for updates with `interval()`.
    const appIsStable$ = this.appRef.isStable.pipe(
      first(isStable => isStable === true)
    );
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    this.subscriptions.map(sub => sub.unsubscribe());
    this.subscriptions = [
      // Listen for router events and refresh the app if we had an available update
      this.router.events
        .pipe(filter(e => e instanceof NavigationStart))
        .subscribe((data: NavigationStart) => {
          if (this.shouldRefreshOnNavigation) {
            window.location.pathname = data.url;
          }
        }),
      // poll every 6 hours and check for updates
      everySixHoursOnceAppIsStable$.subscribe(() =>
        this.swUpdate.checkForUpdate()
      ),
      // start watching updates
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
      }),
      // if the sw was unrecoverable, refresh on navigation
      // TODO: is this really what we want?
      this.swUpdate.unrecoverable.subscribe(event => {
        console.log('[ServiceWorker] unrecoverable', event);
        this.shouldRefreshOnNavigation = true;
      }),
    ];
  }
}
