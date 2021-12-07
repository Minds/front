import { Injectable, Injector } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private service: NgbModal) {}

  static _(ngbModal: NgbModal) {
    return new ModalService(ngbModal);
  }

  /**
   * Presents the modal and returns an Observable
   * @param component the component instance the modal should load
   * @param opts the options to pass to the component's {opts} attribute
   * @param injector
   * @return NgbModalRef
   */
  present(component, opts: any = {}, injector?: Injector): NgbModalRef {
    if (!component) {
      throw new Error('Unknown component class');
    }

    const ref = this.service.open(component, {
      injector,
      centered: true, // FIXME: maybe this shouldn't be true all the time
      windowClass: 'm-modalV3__wrapper',
      // size:
      // ariaDescribedBy:
      // ariaLabelledBy:
      // backdrop: // TODO: use static for when a modal is forced
      // scrollable:
    });

    ref.componentInstance.opts = {
      onDismiss: ref.dismiss,
      /**
       * supporting legacy
       * @deprecated use onDismiss
       **/
      onDismissIntent: ref.dismiss,
      ...opts,
    };

    // TODO: this is temporary. we may want to return a custom type here to not be dependent on the library
    return ref;
  }

  /**
   * Dismisses all open modals
   * its inset component
   */
  dismissAll(): void {
    this.service.dismissAll();
  }
}
