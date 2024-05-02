import { Injectable, Injector, createNgModule } from '@angular/core';
import { ModalRef, ModalService } from '../../../services/ux/modal.service';
import { MindsUser } from '../../../interfaces/entities';
import { UserSelectionModalComponent } from './user-selection-modal.component';
import { UserSelectionModalModule } from './user-selection-modal.module';

/**
 * Options for the user selection modal.
 */
export type UserSelectionModalOpts = {
  /** Function to be called on modal CTA click - can be used to save state. */
  saveFunction: (users: MindsUser[]) => Promise<void>;
  /** Title of the modal. */
  title?: string;
  /** Empty state text in the modal. */
  emptyText?: string;
  /** CTA button text. */
  ctaText?: string;
};

/**
 * Service for opening the user select modal lazily. Modal allows for users
 * to be selected - CTA action is passed via modal opts so that actions can
 * be executed from the list of selected users.
 */
@Injectable({ providedIn: 'root' })
export class UserSelectionModalService {
  constructor(
    private injector: Injector,
    private modalService: ModalService
  ) {}

  /**
   * Opens the modal.
   * @param { UserSelectionModalOpts } opts - options.
   * @returns { Promise<void> }
   */
  public async open(opts: UserSelectionModalOpts): Promise<void> {
    const componentRef: typeof UserSelectionModalComponent =
      await this.getComponentRef();

    const modal: ModalRef<any> = this.modalService.present(componentRef, {
      injector: this.injector,
      lazyModule: UserSelectionModalModule,
      size: 'md',
      data: {
        onCompleted: () => {
          modal.close();
        },
        saveFunction: opts.saveFunction,
        title: opts.title,
        emptyText: opts.emptyText,
        ctaText: opts.ctaText,
      },
    });

    return modal.result;
  }

  /**
   * Gets reference to component to load.
   * @returns { Promise<typeof UserSelectionModalComponent> }
   */
  private async getComponentRef(): Promise<typeof UserSelectionModalComponent> {
    return createNgModule<UserSelectionModalModule>(
      (await import('./user-selection-modal.module')).UserSelectionModalModule,
      this.injector
    ).instance.resolveComponent();
  }
}
