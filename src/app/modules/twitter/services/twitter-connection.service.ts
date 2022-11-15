import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
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
  // in progress subjects for different requests.
  public readonly authUrlRequestInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);
  public readonly configRequestInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  // push to observable to reload config.
  public readonly reloadConfig$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  // redirect path for post authentication.
  public readonly postAuthRedirectPath$: BehaviorSubject<
    string
  > = new BehaviorSubject<string>(null);

  /**
   * @type { Observable<TwitterConfig> } - Config from API.
   * replay will be shared. Emit to reloadConfig$ to reload.
   */
  public config$: Observable<TwitterConfig> = this.reloadConfig$.pipe(
    tap(_ => this.configRequestInProgress$.next(true)),
    // switch stream to be that of an api call to get config.
    switchMap(_ =>
      this.api.get<GetTwitterConfigResponse>('api/v3/twitter/config')
    ),
    tap(_ => this.configRequestInProgress$.next(false)),
    // handle error. will emit null.
    catchError(e => {
      this.authUrlRequestInProgress$.next(false);
      console.error('Could not get twitter config for user', e);
      this.toast.error(
        'An unexpected error has occurred getting your twitter configuration'
      );
      return of(null);
    }),
    // share replay with late subscribers.
    shareReplay()
  );

  /**
   * @type { Observable<string> } - Auth URL from API. Replay will be shared.
   */
  public authUrl$: Observable<string> = this.postAuthRedirectPath$.pipe(
    tap(_ => this.authUrlRequestInProgress$.next(true)),
    // switch stream to be that of an api call to get oauth url.
    switchMap((redirectPath: string) =>
      this.api.get<GetTwitterOauthTokenResponse>(
        'api/v3/twitter/request-oauth-token',
        {
          redirectPath: redirectPath,
        }
      )
    ),
    // map response to that of the auth url.
    map((response: GetTwitterOauthTokenResponse) => {
      if (!response.authorization_url) {
        throw new Error('Could not find authorization URL');
      }
      return response.authorization_url;
    }),
    tap(_ => this.authUrlRequestInProgress$.next(false)),
    // handle error. will emit null.
    catchError(e => {
      this.authUrlRequestInProgress$.next(false);
      console.error('Could not get twitter auth url for user', e);
      this.toast.error(
        'An unexpected error has occurred getting your authorization link'
      );
      return of(null);
    }),
    // share replay with late subscribers.
    shareReplay()
  );

  // whether user is connected to Twitter, from config.
  public readonly isConnected$: Observable<boolean> = this.config$.pipe(
    map((config: TwitterConfig) => Boolean(config?.twitter_oauth2_connected))
  );

  constructor(private api: ApiService, private toast: ToasterService) {}
}
