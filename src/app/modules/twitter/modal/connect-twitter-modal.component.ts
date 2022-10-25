import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { TwitterConnectionService } from '../services/twitter-connection.service';
import { ConnectTwitterModalOpts } from './connect-twitter-modal.types';

/**
 * Modal that prompts the user to connect to Twitter.
 */
@Component({
  selector: 'm-connectTwitterModal',
  templateUrl: './connect-twitter-modal.component.html',
  styleUrls: ['./connect-twitter-modal.component.ng.scss'],
})
export class ConnectTwitterModalComponent implements OnDestroy {
  // whether user is connected to Twitter.
  public readonly isConnected$: Observable<boolean> = this.twitterConnection
    .isConnected$;

  // whether request to get Twitter auth url is in progress.
  public readonly authUrlRequestInProgress$: Observable<boolean> = this
    .twitterConnection.authUrlRequestInProgress$;

  // auth url for Twitter - will trigger an API request when called for first time.
  public authUrl$: Observable<string> = this.twitterConnection.authUrl$;

  // subscription to auth url.
  public authUrlSubscription: Subscription;

  // body text - can be overridden via setModalData().
  public bodyText: string = $localize`:@@CONNECT_TWITTER_MODAL__CONNECT_YOUR_ACCOUNT_WITH_TWITTER:Connect your Minds account with Twitter.`;

  constructor(private twitterConnection: TwitterConnectionService) {}

  ngOnDestroy(): void {
    this.authUrlSubscription?.unsubscribe();
  }

  /**
   * Set modal data.
   * @param { ConnectTwitterModalOpts } opts - options passed from modal service.
   * @returns { void }
   */
  public setModalData(opts: ConnectTwitterModalOpts): void {
    if (opts.bodyText) {
      this.bodyText = opts.bodyText;
    }
  }

  /**
   * Called on connect twitter click - will redirect to Twitter auth page.
   * @param { MouseEvent } $event - mouse event.
   * @returns { void }
   */
  public onConnectClick($event: MouseEvent): void {
    this.twitterConnection.postAuthRedirectPath$.next('/supermind/inbox');
    this.authUrlSubscription = this.authUrl$
      .pipe(take(1))
      .subscribe((authorizationUrl: string) => {
        this.assignWindowLocation(authorizationUrl);
      });
  }

  /**
   * Call window.location.assign - utility wrapper for unit testing.
   * @param { string } url - url to call.
   */
  private assignWindowLocation(url: string): void {
    window.location.assign(url);
  }
}
