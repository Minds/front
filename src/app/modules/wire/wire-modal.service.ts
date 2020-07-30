import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { WireEvent, WireEventType } from './v2/wire-v2.service';
import { OverlayModalService } from '../../services/ux/overlay-modal';
import { FeaturesService } from '../../services/features.service';
import { WireCreatorComponent as WireV2CreatorComponent } from './v2/creator/wire-creator.component';
import { SupportTier } from './v2/support-tiers.service';
import { AuthModalService } from '../auth/modal/auth-modal.service';
import { Session } from '../../services/session';

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
    protected overlayModal: OverlayModalService,
    private session: Session,
    private authModal: AuthModalService
  ) {}

  /**
   * Presents the modal and returns an Observable
   * @param entity
   * @param options
   */
  present(
    entity,
    options: WireModalPresentOptions = {}
  ): Observable<WireEvent | any> {
    const component = WireV2CreatorComponent;
    const wrapperClass = 'm-modalV2__wrapper';

    // if (!this.session.isLoggedIn()) {
    //   return from(
    //     this.authModal.open().then(() => this.present(entity, options))
    //   );
    // }

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
