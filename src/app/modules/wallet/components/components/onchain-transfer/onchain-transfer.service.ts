import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OverlayModalService } from '../../../../../services/ux/overlay-modal';
import { WalletOnchainTransferComponent } from './onchain-transfer.component';

/**
 * Global service to open on-chain transfer modal
 */
@Injectable()
export class OnchainTransferModalService {
  protected injector: Injector;

  constructor(
    protected overlayModal: OverlayModalService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {}

  /**
   * Sets the calling component's injector for DI.
   *
   * @param injector
   */
  setInjector(injector: Injector): OnchainTransferModalService {
    this.injector = injector;
    return this;
  }

  /**
   * Presents the composer modal with a custom injector tree
   */
  present(): Observable<any> {
    if (!this.injector) {
      throw new Error(
        "You need to set the caller component's dependency injector before calling .present()"
      );
    }

    return new Observable<any>(subscriber => {
      let modalOpen = true;

      try {
        this.overlayModal
          .create(
            WalletOnchainTransferComponent,
            null,
            {
              wrapperClass: 'm-modalV2__wrapper',
              onDismissIntent: () => {
                this.dismiss();
              },
            },
            this.injector
          )
          .onDidDismiss(() => {
            modalOpen = false;
            subscriber.complete();
          })
          .present();
      } catch (e) {
        subscriber.error(e);
      }

      return () => {
        this.injector = void 0;

        if (modalOpen) {
          this.dismiss();
        }
      };
    });
  }

  /**
   * Dismisses the modal
   */
  dismiss() {
    this.overlayModal.dismiss();
  }
}
