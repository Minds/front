import { Injectable, Injector } from '@angular/core';
import { ModalService } from '../../../../services/ux/modal.service';
import { MindsGroup } from '../group.model';
import { GroupInviteComponent } from './invite.component';

/**
 * Service to present invite modal and handle its response
 */
@Injectable()
export class GroupInviteModalService {
  constructor(
    protected modalService: ModalService,
    private injector: Injector
  ) {}

  /**
   * Presents the group invite modal with a custom injector tree
   */
  async present(group: MindsGroup): Promise<MindsGroup | null> {
    const modal = this.modalService.present(GroupInviteComponent, {
      data: {
        group,
        onSave: () => {
          modal.dismiss();
        },
      },
      injector: this.injector,
      windowClass: 'm-modalV2__mobileFullCover',
    });

    return modal.result;
  }
}
