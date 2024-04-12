import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { WalletOnchainTransferComponent } from './onchain-transfer.component';
import { ModalService } from '../../../../../services/ux/modal.service';

/**
 * Global service to open on-chain transfer modal
 */
@Injectable()
export class OnchainTransferModalService {
  protected injector: Injector;

  constructor(
    protected modalService: ModalService,
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

    return new Observable<any>((subscriber) => {
      let modal;

      try {
        modal = this.modalService.present(WalletOnchainTransferComponent, {
          injector: this.injector,
        });

        modal.result.then(() => {
          modal = null;
          subscriber.complete();
        });
      } catch (e) {
        subscriber.error(e);
      }

      return () => {
        this.injector = void 0;

        if (modal) {
          modal.dismiss();
        }
      };
    });
  }

  /**
   * Dismisses the modal
   */
  dismiss() {
    this.modalService.dismissAll();
  }
}
