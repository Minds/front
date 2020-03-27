import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { ModalComponent } from './modal.component';

/**
 * Composer data structure
 */
export type ComposerData = {
  activity?: any;
  containerGuid?: any;
};

/**
 * Global service to open a composer modal
 */
@Injectable()
export class ModalService {
  protected injector: Injector;

  constructor(protected overlayModal: OverlayModalService) {}

  /**
   * Sets the calling component's injector for DI.
   *
   * @param injector
   */
  setInjector(injector: Injector): ModalService {
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
            ModalComponent,
            null,
            {
              wrapperClass: 'm-composer__modalWrapper',
              onPost: response => {
                subscriber.next(response);
                this.dismiss();
              },
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
