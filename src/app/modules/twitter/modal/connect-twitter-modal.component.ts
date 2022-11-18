import { Component, OnDestroy } from '@angular/core';
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
  // body text - can be overridden via setModalData().
  public bodyText: string = $localize`:@@CONNECT_TWITTER_MODAL__CONNECT_YOUR_ACCOUNT_WITH_TWITTER:Connect your Minds account with Twitter.`;

  // Callback function for when completed
  onConnect = () => {};

  ngOnDestroy(): void {}

  /**
   * Set modal data.
   * @param { ConnectTwitterModalOpts } opts - options passed from modal service.
   * @returns { void }
   */
  public setModalData(opts: ConnectTwitterModalOpts): void {
    if (opts.bodyText) {
      this.bodyText = opts.bodyText;
    }
    this.onConnect = opts.onConnect;
  }

  /**
   * Called on connect twitter click - will redirect to Twitter auth page.
   * @param { MouseEvent } $event - mouse event.
   * @returns { void }
   */
  public async onConnectClick($event: MouseEvent): Promise<void> {
    this.openTwitterAuthTab();
  }

  /**
   * Call window.location.assign - utility wrapper for unit testing.
   * @param { string } url - url to call.
   * @returns { void }
   */
  private openTwitterAuthTab(): void {
    const windowRef = window.open(
      '/api/v3/twitter/redirect-oauth-token',
      '_blank'
    );

    const timer = setInterval(() => {
      if (windowRef.closed && document.hasFocus()) {
        clearInterval(timer);
        this.onConnect();
      }
    }, 500);
  }
}
