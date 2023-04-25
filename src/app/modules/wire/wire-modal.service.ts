import { Injectable } from '@angular/core';
import { WireEvent, WireEventType } from './v2/wire-v2.service';
import { WireCreatorComponent as WireV2CreatorComponent } from './v2/creator/wire-creator.component';
import { SupportTier } from './v2/support-tiers.service';
import { AuthModalService } from '../auth/modal/auth-modal.service';
import { Session } from '../../services/session';
import { ModalService } from '../../services/ux/modal.service';
import { ActivityEntity } from '../newsfeed/activity/activity.service';

/**
 * WireModal.present() options.default interface
 */
interface WireModalPresentDefaultOptions {
  type: string;
  min?: number;
  upgradeType?: string;
}

/**
 * WireModal.present options interface
 */
interface WireModalPresentOptions {
  default?: WireModalPresentDefaultOptions;
  disableThresholdCheck?: boolean /* UNUSED */;
  supportTier?: SupportTier;
  sourceEntity?: ActivityEntity;
}

/**
 * Handles Wire modal display
 */
@Injectable()
export class WireModalService {
  /**
   * Constructor
   * @param features
   * @param modalService
   * @param session
   * @param authModal
   */
  constructor(
    protected modalService: ModalService,
    private session: Session,
    private authModal: AuthModalService
  ) {}

  /**
   * Presents the modal and returns an Observable
   * @param entity
   * @param options
   */
  async present(
    entity,
    options: WireModalPresentOptions = {}
  ): Promise<WireEvent | any> {
    const modal = this.modalService.present(WireV2CreatorComponent, {
      size: 'lg',
      data: {
        ...options,
        entity,
        onComplete: wire =>
          modal.close({
            type: WireEventType.Completed,
            payload: wire,
          }),
      },
    });

    const result = await modal.result;
    if (!result) {
      return {
        type: WireEventType.Cancelled,
      };
    }
    return result;
  }

  /**
   * Dismisses the modal
   */
  dismiss() {
    this.modalService.dismissAll();
  }
}
