import { Injectable, Injector } from '@angular/core';
import { ActivityEntity } from '../../activity/activity.service';
import { ActivityModalCreatorService } from '../../activity/modal/modal-creator.service';

@Injectable()
export class ActivityV2ModalCreatorService {
  constructor(private modalCreator: ActivityModalCreatorService) {}

  create(
    entity: ActivityEntity,
    injector: Injector,
    activeMultiImageIndex: number
  ): void {
    this.modalCreator.create(entity, injector, activeMultiImageIndex);
  }
}
