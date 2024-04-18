import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  ReplaySubject,
} from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { ApiService } from '../../../common/api/api.service';
import { ToasterService } from '../../../common/services/toaster.service';
import {
  GetTwitterConfigResponse,
  GetTwitterOauthTokenResponse,
  TwitterConfig,
} from './twitter-connection.types';

/**
 * Service for handling Twitter connection and getting config.
 */
@Injectable({ providedIn: 'root' })
export class TwitterConnectionService {
  public readonly configRequestInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private api: ApiService,
    private toast: ToasterService
  ) {}

  async isConnected(showErrorToast: boolean = true): Promise<boolean> {
    this.configRequestInProgress$.next(true);

    try {
      const isConnected = await this.api
        .get<GetTwitterConfigResponse>('api/v3/twitter/config')
        .pipe(
          map((config: TwitterConfig) =>
            Boolean(config?.twitter_oauth2_connected)
          )
        )
        .toPromise();

      this.configRequestInProgress$.next(false);

      return isConnected;
    } catch (err) {
      this.configRequestInProgress$.next(false);

      if (showErrorToast) {
        console.error('Could not get twitter config for user');
        this.toast.error(
          'An unexpected error has occurred getting your twitter configuration'
        );
      }
    }

    return false;
  }
}
