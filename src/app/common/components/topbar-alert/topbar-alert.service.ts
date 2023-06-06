import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  combineLatest,
  filter,
  firstValueFrom,
  map,
  Observable,
  ReplaySubject,
} from 'rxjs';
import { Session } from '../../../services/session';
import { ObjectLocalStorageService } from '../../services/object-local-storage.service';
import { Apollo, gql } from 'apollo-angular';

/** Alert key type */
export type AlertKey = string;

export const GET_TOPBAR_QUERY = gql`
  {
    topbarAlert {
      data {
        id
        attributes {
          message
          enabled
          url
          identifier
          onlyDisplayAfter
        }
      }
    }
  }
`;

/**
 * Service managing the showing and dismiss handling of topbar alerts,
 * that are intended to show above the site nav topbar.
 */
@Injectable({ providedIn: 'root' })
export class TopbarAlertService {
  /** Copy data to be returned from strapi */
  copyData$: Observable<any> = this.apollo
    .use('strapi')
    .watchQuery({
      query: GET_TOPBAR_QUERY,
    })
    .valueChanges.pipe(map((result: any) => result.data.topbarAlert.data));

  /** Identifier, used for dismissing */
  identifier$: Observable<string> = this.copyData$.pipe(
    map(copyData => copyData.attributes.identifier)
  );

  /** Enabled (on/off) */
  enabled$: Observable<boolean> = this.copyData$.pipe(
    map(copyData => Boolean(copyData.attributes.enabled))
  );

  /** Timestamp at which we will show to alert */
  onlyDisplayAfter$: Observable<number> = this.copyData$.pipe(
    map(copyData => Date.parse(copyData.attributes.onlyDisplayAfter))
  );

  /** Array of alerts that have been dismissed (hyrdated on construct) */
  dismissedAlerts$: ReplaySubject<AlertKey[]> = new ReplaySubject();

  /** Logic for dictating if the alert should display */
  shouldShow$: Observable<boolean> = combineLatest([
    this.identifier$,
    this.dismissedAlerts$,
    this.onlyDisplayAfter$,
    this.enabled$,
    this.session.user$.pipe(map(user => !!user)),
  ]).pipe(
    map(
      ([
        identifier,
        dismissedAlerts,
        onlyDisplayAfter,
        enabled,
        isLoggedIn,
      ]) => {
        return (
          dismissedAlerts.indexOf(identifier) === -1 &&
          onlyDisplayAfter < Date.now() &&
          enabled &&
          isLoggedIn
        );
      }
    )
  );

  /** storage key */
  private readonly storageKey = 'topbar-alert:dismissed';

  constructor(
    private session: Session,
    private objectStorage: ObjectLocalStorageService,
    private apollo: Apollo,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.dismissedAlerts$.next(this.getDismissedAlerts());
  }

  /**
   * Dismiss an alert by key and set active alert to null.
   * @param { AlertKey } alertKey - key for alert to dismiss.
   * @returns { void }
   */
  public async dismiss(): Promise<void> {
    const alertKey = await firstValueFrom(this.identifier$);
    if (isPlatformBrowser(this.platformId)) {
      this.objectStorage.setSingle(this.storageKey, {
        [alertKey]: '1',
      });
    }
    this.dismissedAlerts$.next(this.getDismissedAlerts());
  }

  /**
   * Gets an array of undismissed alerts.
   * @returns { AlertKey[] } - array of the keys of undismissed alerts.
   */
  private getDismissedAlerts(): AlertKey[] {
    if (isPlatformServer(this.platformId)) {
      return [];
    }

    return Object.keys(this.objectStorage.getAll(this.storageKey));
  }
}
