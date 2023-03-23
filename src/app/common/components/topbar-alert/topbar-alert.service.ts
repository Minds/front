import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, Subscription } from 'rxjs';
import { Session } from '../../../services/session';
import { ObjectLocalStorageService } from '../../services/object-local-storage.service';
import { SiteService } from '../../services/site.service';

/** Array of alert keys */
export const ALERT_KEYS: string[] = ['referral'];

/** Alert key type - gets the strings at numerical indexes in the alert keys array */
export type AlertKey = typeof ALERT_KEYS[number];

/**
 * Service managing the showing and dismiss handling of topbar alerts,
 * that are intended to show above the site nav topbar.
 */
@Injectable({ providedIn: 'root' })
export class TopbarAlertService implements OnDestroy {
  /** currently active alert */
  public readonly activeAlert$: BehaviorSubject<AlertKey> = new BehaviorSubject<
    AlertKey
  >(null);

  /** whether alert should be shown based on whether an active alert is set */
  public readonly shouldShow$: Observable<boolean> = this.activeAlert$.pipe(
    map((activeAlert: AlertKey) => Boolean(activeAlert))
  );

  /** storage key */
  private readonly storageKey = 'topbar-alert:dismissed';

  /** array of alert keys */
  private readonly alertKeys: AlertKey[] = ALERT_KEYS;

  /** logged in subscription */
  private readonly loggedInSubscription: Subscription;

  constructor(
    private session: Session,
    private site: SiteService,
    private objectStorage: ObjectLocalStorageService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.activeAlert$.next(this.getActiveAlert());

    this.loggedInSubscription = this.session.loggedinEmitter
      .pipe(filter(Boolean))
      .subscribe((loggedIn: boolean) => {
        this.activeAlert$.next(this.getActiveAlert());
      });
  }

  ngOnDestroy(): void {
    this.loggedInSubscription?.unsubscribe();
  }

  /**
   * Dismiss an alert by key and set active alert to null.
   * @param { AlertKey } alertKey - key for alert to dismiss.
   * @returns { void }
   */
  public dismiss(alertKey: AlertKey): void {
    if (isPlatformBrowser(this.platformId)) {
      this.objectStorage.setSingle(this.storageKey, {
        [alertKey]: '1',
      });
    }
    this.activeAlert$.next(null);
  }

  /**
   * Get the alert that should be made active, or null if none should.
   * @returns { AlertKey } alert that should be active.
   */
  private getActiveAlert(): AlertKey {
    if (!this.session.isLoggedIn() || this.site.isProDomain) {
      return null;
    }

    const undismissedAlerts: AlertKey[] = this.getUndismissedAlerts();

    return undismissedAlerts.length ? undismissedAlerts[0] : null;
  }

  /**
   * Gets an array of undismissed alerts.
   * @returns { AlertKey[] } - array of the keys of undismissed alerts.
   */
  private getUndismissedAlerts(): AlertKey[] {
    if (isPlatformServer(this.platformId)) {
      return [];
    }

    const dismissedAlerts: string[] = Object.keys(
      this.objectStorage.getAll(this.storageKey)
    );

    return this.alertKeys.filter(
      (alertKey: AlertKey) => !dismissedAlerts.includes(alertKey)
    );
  }
}
