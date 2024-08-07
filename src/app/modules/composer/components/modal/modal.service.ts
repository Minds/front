import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalComponent } from './modal.component';
import { ModalService } from '../../../../services/ux/modal.service';
import { EmailConfirmationService } from '../../../../common/components/email-confirmation/email-confirmation.service';
import { ClientMetaData } from '../../../../common/services/client-meta.service';
import { PermissionIntentsService } from '../../../../common/services/permission-intents.service';
import { PermissionsEnum } from '../../../../../graphql/generated.engine';

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
  protected onPostFn = (_) => {};

  constructor(
    protected modalService: ModalService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected emailConfirmation: EmailConfirmationService,
    private permissionIntentsService: PermissionIntentsService
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
   * Provide a callback function to tap in to the onPost callback
   * @param fn
   * @returns
   */
  onPost(fn: any): ComposerModalService {
    this.onPostFn = fn;
    return this;
  }

  /**
   * Presents the composer modal with a custom injector tree
   */
  present(clientMeta: ClientMetaData = null): Promise<any> {
    if (!this.emailConfirmation.ensureEmailConfirmed()) return;

    if (
      !this.permissionIntentsService.checkAndHandleAction(
        PermissionsEnum.CanCreatePost
      )
    ) {
      return;
    }

    const modal = this.modalService.present(ModalComponent, {
      data: {
        onPost: (response) => {
          modal.close(response);
          this.onPostFn(response);
        },
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
