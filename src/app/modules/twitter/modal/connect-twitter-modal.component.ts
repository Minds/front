import { Component, OnDestroy } from '@angular/core';
import { ConnectTwitterModalOpts } from './connect-twitter-modal.types';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ModalsModule } from '~/modules/modals/modals.module';
import { CommonModule } from '~/common/common.module';
import { ModalCloseButtonComponent } from '~/common/components/modal-close-button/modal-close-button.component';

/**
 * Modal that prompts the user to connect to Twitter.
 */
@Component({
  selector: 'm-connectTwitterModal',
  templateUrl: './connect-twitter-modal.component.html',
  styleUrls: ['./connect-twitter-modal.component.ng.scss'],
  imports: [
    NgCommonModule,
    CommonModule,
    ModalsModule,
    ModalCloseButtonComponent,
  ],
})
export class ConnectTwitterModalComponent implements OnDestroy {
  // context text - provides additional context in mobile widths
  public contextText: string = '';

  // title text - can be overridden via setModalData().
  public titleText: string = $localize`:@@CONNECT_TWITTER_MODAL__HEADER:Connect to Twitter`;

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
    if (opts.contextText) {
      this.contextText = opts.contextText;
    }
    if (opts.titleText) {
      this.titleText = opts.titleText;
    }
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
