import { Injectable, Injector, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { OverlayModalService } from './overlay-modal';

/**
 * Stackable modal state
 */
export enum StackableModalState {
  Open = 1,
  Dismissed,
}

/**
 * Stackable modal event
 */
export interface StackableModalEvent {
  state: StackableModalState;
}

@Injectable()
export class StackableModalService {
  private container;

  // (A comment acknowledging that this purposely isn't in the constructor)
  private overlayModalService: OverlayModalService;

  static _() {
    return new StackableModalService();
  }

  /**
   * @param container
   * Connect this service to its corresponding StackableModalComponent
   */
  setContainer(stackableModalComponent) {
    this.container = stackableModalComponent;
    this.setScopedService();
    return this;
  }

  setScopedService() {
    this.overlayModalService = this.container.overlayModalService;
  }

  /**
   * Presents the modal and returns an Observable
   */
  present(
    component,
    data: any = {},
    opts: any = {},
    injector?: Injector
  ): Observable<StackableModalEvent> {
    if (!this.container) {
      throw new Error('Missing stackable modal container');
    }

    if (!component) {
      throw new Error('Unknown component class');
    }

    opts = {
      ...{
        stackable: true,
      },
      ...opts,
    };

    /**
     * Dynamically create an overlay modal
     * and connect it to its scoped service
     */
    const dynamicOverlayModal = this.container.createDynamicOverlayModal(
      opts.stackable
    );
    this.overlayModalService.setContainer(dynamicOverlayModal);

    this.container.hidden = false;

    /**
     * Populate the dynamic overlay modal with the component
     * of your choice and return its state as an observable
     * (so you can call dismiss functions from the triggering component
     * when the state becomes 'Dismissed')
     */

    return new Observable<StackableModalEvent>(subscriber => {
      let dismissed = false;
      /**
       * Populate the inset component
       */
      this.overlayModalService
        .create(component, data, opts, injector)
        .onDidDismiss(() => {
          dismissed = true;
          this.container.hidden = true;
          subscriber.next({
            state: StackableModalState.Dismissed,
          });
          subscriber.complete();
        })
        .present();

      return () => {
        if (!dismissed) {
          try {
            this.dismiss();
          } catch (e) {
            console.error('StackableModalComponent.present', component, e);
          }
        }
      };
    });
  }

  /**
   * Dismisses the stackable modal and destroys
   * its inset component
   */
  dismiss(): void {
    this.overlayModalService.dismiss();
    this.container.dismiss();
  }
}
