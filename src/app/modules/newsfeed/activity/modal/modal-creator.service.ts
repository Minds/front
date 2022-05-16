import { Injectable, Injector } from '@angular/core';
import { ActivityEntity } from '../activity.service';
import { ActivityModalComponent } from './modal.component';
import { ModalService } from '../../../../services/ux/modal.service';
import { ActivityV2ModalComponent } from '../../activity-v2/modal/modal.component';
import { ActivityV2ExperimentService } from '../../../experiments/sub-services/activity-v2-experiment.service';
import { AnalyticsService } from '../../../../services/analytics';
import * as snowplow from '@snowplow/browser-tracker';

// TODO: this will need to move to activity-v2 when ready
@Injectable()
export class ActivityModalCreatorService {
  constructor(
    private modalService: ModalService,
    private activityV2Experiment: ActivityV2ExperimentService,
    private analytics: AnalyticsService
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

    if (this.shouldTrackActionEvent(entity)) {
      this.trackActionEvent(entity);
    }

    this.modalService.present(modalComp, opts);
  }

  /**
   * Adds an action event to analytics for modal click.
   * @param { ActivityEntity } entity - entity for event.
   * @returns { void }
   */
  private trackActionEvent(entity: ActivityEntity): void {
    snowplow.trackSelfDescribingEvent({
      event: {
        schema: 'iglu:com.minds/view/jsonschema/1-0-0',
        data: {
          ref: 'activity-modal-open',
          entity_guid: entity.guid,
        },
      },
      context: this.analytics.getContexts(),
    });
  }

  /**
   * Whether action event should be tracked in analytics.
   * @param { ActivityEntity } entity - entity to check.
   * @returns { boolean } - true if event should be tracked.
   */
  private shouldTrackActionEvent(entity: ActivityEntity): boolean {
    return entity.subtype === 'image' || entity.subtype === 'video';
  }
}
