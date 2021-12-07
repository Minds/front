import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private service: NgbModal) {}

  // TODO: do we need this one?
  static _(ngbModal: NgbModal) {
    return new ModalService(ngbModal);
  }

  /**
   * Presents the modal and returns an Observable
   * TODO what are the params?
   * @param component the component instance the modal should load
   * @param opts the options to pass to the component
   * @param injector
   * @return Observable TODO: make this more clear
   */
  present(component, opts: any = {}, injector?: Injector): NgbModalRef {
    if (!component) {
      throw new Error('Unknown component class');
    }

    const ref = this.service.open(component, {
      injector,
      centered: true, // FIXME: maybe this shouldn't be true all the time
      // modalDialogClass: 'm-modalV2__wrapper',
      windowClass: 'm-modalV3__wrapper',
      // backdropClass: 'somethingelseentirely-backdrop',

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
   * Dismisses the stackable modal and destroys
   * its inset component
   */
  dismissAll(): void {
    this.service.dismissAll();
  }
}
