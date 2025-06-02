import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  combineLatest,
  EMPTY,
  firstValueFrom,
  map,
  Observable,
  of,
  ReplaySubject,
} from 'rxjs';
import { Session } from '../../../services/session';
import { ObjectLocalStorageService } from '../../services/object-local-storage.service';
import { Apollo, gql } from 'apollo-angular';
import { IS_TENANT_NETWORK } from '../../injection-tokens/tenant-injection-tokens';
import { ConfigsService } from '../../services/configs.service';
import { PushNotificationService } from '../../services/push-notification.service';

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
  copyData$: Observable<any>;

  /** Identifier, used for dismissing */
  identifier$: Observable<string>;

  /** Enabled (on/off) */
  enabled$: Observable<boolean>;

  /** Timestamp at which we will show to alert */
  onlyDisplayAfter$: Observable<number>;

  /** Array of alerts that have been dismissed (hyrdated on construct) */
  dismissedAlerts$: ReplaySubject<AlertKey[]> = new ReplaySubject();

  /** Logic for dictating if the alert should display */
  shouldShow$: Observable<boolean>;

  /** Logic for dictating if the CMS driven alert should display */
  shouldShowCmsAlert$: Observable<boolean>;

  /** Logic for dictating if the tenant trial alert should be shown. */
  shouldShowTenantTrialAlert$: Observable<boolean>;

  /** storage key */
  private readonly storageKey = 'topbar-alert:dismissed';

  constructor(
    private session: Session,
    private objectStorage: ObjectLocalStorageService,
    private apollo: Apollo,
    private config: ConfigsService,
    private pushNotificationService: PushNotificationService,
    @Inject(IS_TENANT_NETWORK) private readonly isTenantNetwork: boolean,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.dismissedAlerts$.next(this.getDismissedAlerts());

    this.copyData$ =
      isPlatformBrowser(this.platformId) && !isTenantNetwork
        ? this.apollo
            .use('strapi')
            .watchQuery({
              query: GET_TOPBAR_QUERY,
            })
            .valueChanges.pipe(
              map((result: any) => result.data.topbarAlert.data)
            )
        : of(null);

    this.identifier$ = this.copyData$.pipe(
      map((copyData) => copyData?.attributes?.identifier)
    );

    this.enabled$ = this.copyData$.pipe(
      map((copyData) => Boolean(copyData?.attributes?.enabled))
    );

    this.onlyDisplayAfter$ = this.copyData$.pipe(
      map((copyData) => Date.parse(copyData?.attributes?.onlyDisplayAfter))
    );

    this.shouldShowCmsAlert$ = isPlatformServer(this.platformId)
      ? of(null)
      : combineLatest([
          this.identifier$,
          this.dismissedAlerts$,
          this.onlyDisplayAfter$,
          this.enabled$,
          this.session.user$.pipe(map((user) => !!user)),
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
                !this.isTenantNetwork &&
                dismissedAlerts.indexOf(identifier) === -1 &&
                onlyDisplayAfter < Date.now() &&
                enabled &&
                isLoggedIn
              );
            }
          )
        );

    this.shouldShowTenantTrialAlert$ = of(
      this.isTenantNetwork && this.config.get('tenant')?.['is_trial']
    );

    this.shouldShow$ = isPlatformServer(this.platformId)
      ? of(null)
      : combineLatest([
          this.shouldShowCmsAlert$,
          this.shouldShowTenantTrialAlert$,
        ]).pipe(
          map(
            ([shouldShowCmsAlert, shouldShowTenantTrialAlert]: [
              boolean,
              boolean,
            ]) => {
              return shouldShowTenantTrialAlert || shouldShowCmsAlert;
            }
          )
        );
  }

  /**
   * Whether tenant trial alert should be shown.
   * @returns { boolean } - true if tenant trial alert should be shown.
   */
  public shouldShowTenantTrialAlert(): boolean {
    return this.isTenantNetwork && this.config.get('tenant')?.['is_trial'];
  }

  /**
   * Dismiss an alert by key and set active alert to null.
   * @param { AlertKey } alertKey - key for alert to dismiss.
   * @returns { void }
   */
  public async dismiss(alertKey: string = null): Promise<void> {
    if (!alertKey) {
      alertKey = await firstValueFrom(this.identifier$);
    }
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
