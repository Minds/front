import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ModalComponent } from './modal.component';
import isMobile from '../../../../helpers/is-mobile';
import { ModalService } from '../../../../services/ux/modal.service';
import { EmailConfirmationService } from '../../../../common/components/email-confirmation/email-confirmation.service';

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
export class ComposerModalService {
  protected injector: Injector;

  constructor(
    protected modalService: ModalService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected emailConfirmation: EmailConfirmationService
  ) {}

  /**
   * Sets the calling component's injector for DI.
   *
   * @param injector
   */
  setInjector(injector: Injector): ComposerModalService {
    this.injector = injector;
    return this;
  }

  /**
   * Presents the composer modal with a custom injector tree
   */
  present(): Promise<any> {
    if (!this.emailConfirmation.ensureEmailConfirmed()) return;
    const modal = this.modalService.present(ModalComponent, {
      data: {
        onPost: response => modal.close(response),
      },
      modalDialogClass: 'modal-content--without-padding',
      injector: this.injector,
    });

    return modal.result.finally(() => {
      this.injector = void 0;
    });
  }

  /**
   * Dismisses the modal
   */
  dismiss() {
    this.modalService.dismissAll();
  }
}
