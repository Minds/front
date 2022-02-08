import { Injectable, Injector } from '@angular/core';
import { FeaturesService } from '../../../../services/features.service';
import { Router } from '@angular/router';
import { ActivityEntity } from '../activity.service';
import { ActivityModalComponent } from './modal.component';
import { ModalService } from '../../../../services/ux/modal.service';

@Injectable()
export class ActivityModalCreatorService {
  constructor(
    private modalService: ModalService,
    private features: FeaturesService,
    private router: Router
  ) {}

  create(entity: ActivityEntity, injector: Injector): void {
    if (!this.modalService.canOpenInModal()) {
      return;
    }

    /**
     * NOTE: 'modal_source_url' is only used in the MediaModalComponent
     * and can be removed when it is replaced with ActivityModalComponent
     */
    entity.modal_source_url = this.router.url;

    if (entity.type === 'comment') {
      entity.entity_guid = (entity as any).attachment_guid;
    }

    this.modalService.present(ActivityModalComponent, {
      modalDialogClass: 'modal-fitcontent',
      data: {
        entity,
      },
      injector,
    });
  }
}
