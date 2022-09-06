import { Injectable, Injector } from '@angular/core';
import { ActivityEntity } from '../activity.service';
import { ActivityModalComponent } from './modal.component';
import { ModalService } from '../../../../services/ux/modal.service';
import { ActivityV2ModalComponent } from '../../activity-v2/modal/modal.component';
import { ActivityV2ExperimentService } from '../../../experiments/sub-services/activity-v2-experiment.service';
import {
  AnalyticsService,
  ContextualizableEntity,
} from '../../../../services/analytics';

// TODO: this will need to move to activity-v2 when ready
@Injectable()
export class ActivityModalCreatorService {
  constructor(
    private modalService: ModalService,
    private activityV2Experiment: ActivityV2ExperimentService,
    private analytics: AnalyticsService
  ) {}

  create(
    entity: ActivityEntity,
    injector: Injector,
    activeMultiImageIndex?: number
  ): void {
    if (!this.modalService.canOpenInModal()) {
      return;
    }

    if (entity.type === 'comment') {
      entity.entity_guid = (entity as any).attachment_guid;
    }

    const modalComp = this.activityV2Experiment.isActive()
      ? ActivityV2ModalComponent
      : ActivityModalComponent;

    let opts = {
      modalDialogClass: 'modal-fullwidth',
      size: 'xl',
      data: {
        entity,
        activeMultiImageIndex: activeMultiImageIndex
          ? activeMultiImageIndex
          : 0,
      },
      injector,
    };

    if (this.shouldTrackActionEvent(entity)) {
      this.trackActionEvent(entity as ContextualizableEntity);
    }

    this.modalService.present(modalComp, opts);
  }

  /**
   * Tracks a click event with entity_context.
   * @param { ContextualizableEntity } entity - entity for event.
   * @returns { void }
   */
  private trackActionEvent(entity: ContextualizableEntity): void {
    this.analytics.trackClick('activity-modal-open', [
      this.analytics.buildEntityContext(entity),
    ]);
  }

  /**
   * Whether click should be tracked in analytics.
   * @param { ActivityEntity } entity - entity to check.
   * @returns { boolean } - true if event should be tracked.
   */
  private shouldTrackActionEvent(entity: ActivityEntity): boolean {
    return entity.subtype === 'image' || entity.subtype === 'video';
  }
}
