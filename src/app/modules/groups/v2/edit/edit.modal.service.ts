// ojm todo
import { Injectable, Injector } from '@angular/core';
import { ModalService } from '../../../../services/ux/modal.service';
import { MindsGroup } from '../group.model';
import { GroupEditComponent } from './edit.component';
import { GroupService } from '../group.service';

/**
 * Service to present Edit modal and handle its response
 */
@Injectable()
export class GroupEditModalService {
  constructor(
    protected modalService: ModalService,
    private injector: Injector
  ) {}

  /**
   * Presents the group edit modal with a custom injector tree
   */
  async present(group: MindsGroup): Promise<MindsGroup | null> {
    const modal = this.modalService.present(GroupEditComponent, {
      data: {
        group,
        onSave: editedGroup => {
          modal.close(editedGroup);
        },
      },
      size: 'lg',
      injector: this.injector,
    });

    return modal.result;
  }
}
