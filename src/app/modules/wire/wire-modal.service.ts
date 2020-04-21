import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WireEvent, WireEventType } from './v2/wire-v2.service';
import { OverlayModalService } from '../../services/ux/overlay-modal';
import { FeaturesService } from '../../services/features.service';
import { WireCreatorComponent as WireV1CreatorComponent } from './creator/creator.component';
import { WireCreatorComponent as WireV2CreatorComponent } from './v2/creator/wire-creator.component';

/**
 * WireModal.present() options.default interface
 */
interface WireModalPresentDefaultOptions {
  type: string;
  min: number;
}

/**
 * WireModal.present options interface
 */
interface WireModalPresentOptions {
  default?: WireModalPresentDefaultOptions;
  disableThresholdCheck?: boolean /* UNUSED */;
}

/**
 * Handles Wire modal display
 */
@Injectable()
export class WireModalService {
  /**
   * Constructor
   * @param features
   * @param overlayModal
   */
  constructor(
    protected features: FeaturesService,
    protected overlayModal: OverlayModalService
  ) {}

  /**
   * Presents the modal and returns an Observable
   * @param entity
   * @param options
   */
  present(
    entity,
    options: WireModalPresentOptions = {}
  ): Observable<WireEvent> {
    const isV2 = this.features.has('pay');

    const component = isV2 ? WireV2CreatorComponent : WireV1CreatorComponent;
    const wrapperClass = isV2 ? 'm-modalV2__wrapper' : '';

    return new Observable<WireEvent>(subscriber => {
      let completed = false;

      this.overlayModal
        .create(component, entity, {
          ...options,

          onComplete: wire => {
            completed = true;

            subscriber.next({
              type: WireEventType.Completed,
              payload: wire,
            });

            this.dismiss();
          },
          onDismissIntent: () => this.dismiss(),
          wrapperClass,
        })
        .onDidDismiss(() => {
          if (!completed) {
            subscriber.next({
              type: WireEventType.Cancelled,
            });
          }

          subscriber.complete();
        })
        .present();

      return () => {
        if (!completed) {
          try {
            this.overlayModal.dismiss();
          } catch (e) {
            console.error('WireModalService.present', component, e);
          }
        }
      };
    });
  }

  /**
   * Dismisses the modal
   */
  dismiss() {
    this.overlayModal.dismiss();
  }
}
