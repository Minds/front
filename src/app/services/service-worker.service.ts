import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

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

  constructor(private swUpdate: SwUpdate, private router: Router) {}

  async watchForUpdates() {
    const enabled = this.swUpdate.isEnabled;
    if (!enabled) {
      console.log('[ServiceWorker] not enabled');
      return null;
    }
    console.log('[ServiceWorker] watching for updates');

    this.router.events
      .pipe(filter(e => e instanceof NavigationStart))
      .subscribe((data: NavigationStart) => {
        if (this.shouldRefreshOnNavigation) {
          window.location.pathname = data.url;
        }
      });

    this.swUpdate.versionUpdates.subscribe(event => {
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
      console.log('[ServiceWorker] Version update', event);
    });
    this.swUpdate.unrecoverable.subscribe(event => {
      console.log('[ServiceWorker] unrecoverable', event);
      this.shouldRefreshOnNavigation = true;
    });
  }
}
