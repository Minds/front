import { Injectable, Injector, createNgModule } from '@angular/core';
import { ModalRef, ModalService } from '../../../../services/ux/modal.service';
import { UserSelectModalComponent } from './user-select-modal.component';
import { UserSelectModalModule } from './user-select-modal.module';
import { MindsUser } from '../../../../interfaces/entities';

/** Modal opts. */
export type UserSelectModalOpts = {
  saveFunction: (selectedUsers: MindsUser[]) => Promise<boolean>;
  title: string;
  ctaText: string;
  emptyStateText: string;
  excludedUserGuids?: string[];
};

/**
 * User select modal service - Allows users to be selected.
 */
@Injectable({ providedIn: 'root' })
export class UserSelectModalService {
  constructor(
    private injector: Injector,
    private modalService: ModalService
  ) {}

  /**
   * Opens the user select modal.
   * @returns { Promise<string> } - The chat room id.
   */
  public async open(opts: UserSelectModalOpts): Promise<string> {
    const componentRef: typeof UserSelectModalComponent =
      await this.getComponentRef();

    const modal: ModalRef<any> = this.modalService.present(componentRef, {
      injector: this.injector,
      lazyModule: UserSelectModalModule,
      size: 'md',
      data: {
        title: opts.title,
        ctaText: opts.ctaText,
        emptyStateText: opts.emptyStateText,
        excludedUserGuids: opts.excludedUserGuids ?? null,
        onCompleted: async (selectedUsers: MindsUser[]) => {
          if (await opts.saveFunction(selectedUsers)) {
            modal.close();
          }
        },
      },
    });

    return modal.result;
  }

  /**
   * Gets reference to component to load
   * @returns { Promise<typeof UserSelectModalComponent> }
   */
  private async getComponentRef(): Promise<typeof UserSelectModalComponent> {
    return createNgModule<UserSelectModalModule>(
      (await import('./user-select-modal.module')).UserSelectModalModule,
      this.injector
    ).instance.resolveComponent();
  }
}
