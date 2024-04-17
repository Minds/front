import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  share,
} from 'rxjs/operators';
import { ApiService } from '../../../../common/api/api.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import {
  SupermindConfig,
  SupermindSettings,
  SupermindSettingsGetApiResponse,
  SupermindSettingsPostApiResponse,
} from './supermind.types';

/**
 * Service for getting and submitted Supermind settings for a user.
 */
@Injectable({ providedIn: 'root' })
export class SettingsV2SupermindService {
  constructor(
    private api: ApiService,
    private toaster: ToasterService,
    private config: ConfigsService
  ) {}

  /**
   * @type { Observable<SupermindSettingsGetApiResponse> } settings$ - gets supermind settings from server.
   */
  public settings$: Observable<SupermindSettingsGetApiResponse> = this.api
    .get<SupermindSettingsGetApiResponse>('api/v3/supermind/settings')
    .pipe(
      debounceTime(100),
      // if there is no change, do nothing.
      distinctUntilChanged(),
      // on error.
      catchError((e) => this.handleError$(e)),
      // share amongst subscribers.
      share()
    );

  /**
   * Update a users settings.
   * @param { SupermindSettings } settings - settings to submit.
   * @returns { Observable<SupermindSettingsPostApiResponse> } response.
   */
  public updateSettings$(
    settings: SupermindSettings
  ): Observable<SupermindSettingsPostApiResponse> {
    return this.api
      .post<SupermindSettingsPostApiResponse>(
        'api/v3/supermind/settings',
        settings
      )
      .pipe(
        // if there is no change, do nothing.
        distinctUntilChanged(),
        // on error
        catchError((e) => this.handleError$(e))
      );
  }

  /**
   * Get config containing minimum thresholds.
   * @returns { SupermindConfig }
   */
  public getConfig(): SupermindConfig {
    return this.config.get('supermind');
  }

  /**
   * Handle API errors from Observable streams.
   * @param { any } e - error.
   * @returns { Observable<null> } - empty observable - will still emit.
   */
  private handleError$(e: any): Observable<null> {
    if (e?.error?.errors?.length && e.error.errors[0].message) {
      this.toaster.error(e.error.errors[0].message);
    } else {
      this.toaster.error(e?.error?.message ?? 'An unknown error has occurred');
    }
    return of(null);
  }
}
