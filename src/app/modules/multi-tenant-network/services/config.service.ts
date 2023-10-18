import { Injectable, OnDestroy } from '@angular/core';
import {
  GetMultiTenantConfigGQL,
  GetMultiTenantConfigQuery,
  MultiTenantColorScheme,
  MultiTenantConfig,
  SetMultiTenantConfigGQL,
  SetMultiTenantConfigMutation,
  SetMultiTenantConfigMutationVariables,
} from '../../../../graphql/generated.engine';
import { ApolloQueryResult } from '@apollo/client';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  map,
  of,
  take,
  tap,
} from 'rxjs';
import { ThemeColorChangeService } from '../../../common/services/theme-color-change.service';
import { ThemeService } from '../../../common/services/theme.service';

/**
 * Service for fetching and updating multi-tenant network config.
 */
@Injectable({ providedIn: 'root' })
export class MultiTenantNetworkConfigService implements OnDestroy {
  /** Subject to store config values. */
  public readonly config$: BehaviorSubject<
    MultiTenantConfig
  > = new BehaviorSubject<MultiTenantConfig>(null);

  /** Subject to store whether config has been loaded. */
  public readonly configLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  private configFetchSubscription: Subscription;

  constructor(
    private getMultiTenantConfigGQL: GetMultiTenantConfigGQL,
    private setMultiTenantConfigGQL: SetMultiTenantConfigGQL,
    private themeService: ThemeService,
    private themeColorChangeService: ThemeColorChangeService
  ) {}

  ngOnDestroy(): void {
    this.configFetchSubscription?.unsubscribe();
  }

  /**
   * Fetches config from server and updates local state.
   * @returns { void }
   */
  public fetchConfig(): void {
    if (this.configFetchSubscription) {
      console.warn(
        'A request to load multi-tenant config is already in progress'
      );
      return;
    }
    this.configFetchSubscription = this.getConfig().subscribe(
      (config: MultiTenantConfig): void => {
        this.configLoaded$.next(true);
        this.config$.next(config);
      }
    );
  }

  /**
   * Updates config on server and local state.
   * @returns { Observable<boolean> } true if config was updated.
   */
  public updateConfig(
    values: Omit<SetMultiTenantConfigMutationVariables, 'tenantId'>
  ): Observable<boolean> {
    return this.setMultiTenantConfigGQL.mutate(values).pipe(
      take(1),
      map((result: ApolloQueryResult<SetMultiTenantConfigMutation>) => {
        return Boolean(result.data.multiTenantConfig);
      }),
      tap((success: boolean): void => {
        if (success) {
          this.updateLocalState(values);
        }
      }),
      catchError(
        (e: unknown): Observable<boolean> => {
          console.error(e);
          return of(false);
        }
      )
    );
  }

  /**
   * Gets config from server.
   * @returns { Observable<MultiTenantConfig> } config from server.
   */
  private getConfig(): Observable<MultiTenantConfig> {
    return this.getMultiTenantConfigGQL
      .fetch(null, {
        fetchPolicy: 'no-cache',
      })
      .pipe(
        take(1),
        map((result: ApolloQueryResult<GetMultiTenantConfigQuery>) => {
          return result?.data?.multiTenantConfig ?? {};
        })
      );
  }

  /**
   * Updates local state.
   * @param { Omit<SetMultiTenantConfigMutationVariables, 'tenantId'> } values - config values
   * to update local state with.
   * @returns { void }
   */
  private updateLocalState(
    values: Omit<SetMultiTenantConfigMutationVariables, 'tenantId'>
  ): void {
    this.config$.next({
      ...this.config$.getValue(),
      ...values,
    });

    if (values.primaryColor) {
      this.themeColorChangeService.changeFromConfig({
        primary_color: values.primaryColor,
      });
    }

    if (values.colorScheme) {
      this.themeService.isDark$.next(
        values.colorScheme === MultiTenantColorScheme.Dark
      );
    }
  }
}
