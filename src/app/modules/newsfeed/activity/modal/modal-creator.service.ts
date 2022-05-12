import { Injectable, Injector } from '@angular/core';
import { ActivityEntity } from '../activity.service';
import { ActivityModalComponent } from './modal.component';
import { ModalService } from '../../../../services/ux/modal.service';
import { ExperimentsService } from '../../../experiments/experiments.service';
import { ActivityV2ModalComponent } from '../../activity-v2/modal/modal.component';
import { ActivityV2ExperimentService } from '../../../experiments/sub-services/activity-v2-experiment.service';

// TODO: this will need to move to activity-v2 when ready
@Injectable()
export class ActivityModalCreatorService {
  constructor(
    private modalService: ModalService,
    private activityV2Experiment: ActivityV2ExperimentService
  ) {}

  create(entity: ActivityEntity, injector: Injector): void {
    if (!this.modalService.canOpenInModal()) {
      return;
    }

    if (entity.type === 'comment') {
      entity.entity_guid = (entity as any).attachment_guid;
    }

    const modalComp = this.activityV2Experiment.isActive()
      ? ActivityV2ModalComponent
      : ActivityModalComponent;

    const opts = {
      modalDialogClass: 'modal-fullwidth',
      size: 'xl',
      data: {
        entity,
      },
      injector,
    };

    this.modalService.present(modalComp, opts);
  }
}
