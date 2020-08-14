import { Injectable, Injector } from '@angular/core';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { FeaturesService } from '../../../../services/features.service';
import { Router } from '@angular/router';
import { ActivityEntity } from '../activity.service';
import { ActivityModalComponent } from './modal.component';
import { MediaModalComponent } from '../../../media/modal/modal.component';

@Injectable()
export class ActivityModalCreatorService {
  constructor(
    private overlayModal: OverlayModalService,
    private features: FeaturesService,
    private router: Router
  ) {}

  create(entity: ActivityEntity, injector: Injector): void {
    if (!this.overlayModal.canOpenInModal()) {
      return;
    }

    /**
     * 'modal_source_url' is only used in the MediaModalComponent
     * and can be removed when it is replaced with ActivityModalComponent
     */
    entity.modal_source_url = this.router.url;

    //todoojm uncomment
    // const modal = this.features.has('activity-modal')
    //   ? ActivityModalComponent
    //   : MediaModalComponent;

    const modal = ActivityModalComponent;

    this.overlayModal
      .create(
        modal,
        { entity: entity },
        {
          class: 'm-overlayModal--media',
        },
        injector
      )
      .present();
  }
}
