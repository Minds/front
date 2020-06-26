import { Injectable, Injector } from '@angular/core';
import { OverlayModalService } from '../../../../../services/ux/overlay-modal';
import { Observable } from 'rxjs';
import { SupportTier } from '../../../../wire/v2/support-tiers.service';
import { ChannelShopMembershipsEditComponent } from './edit.component';

@Injectable()
export class ChannelShopMembershipsEditModalService {
  /**
   * Constructor
   * @param overlayModal
   * @param injector
   */
  constructor(
    protected overlayModal: OverlayModalService,
    protected injector: Injector
  ) {}

  /**
   * Presents the composer modal with a custom injector tree
   */
  present(supportTier?: SupportTier | null): Observable<SupportTier> {
    return new Observable<any>(subscriber => {
      let modalOpen = true;

      try {
        this.overlayModal
          .create(
            ChannelShopMembershipsEditComponent,
            supportTier || null,
            {
              wrapperClass: 'm-modalV2__wrapper',
              onSave: response => {
                subscriber.next(response);
                this.dismiss();
              },
              onDismissIntent: () => {
                this.dismiss();
              },
            },
            this.injector
          )
          .onDidDismiss(() => {
            modalOpen = false;
            subscriber.complete();
          })
          .present();
      } catch (e) {
        subscriber.error(e);
      }

      return () => {
        this.injector = void 0;

        if (modalOpen) {
          this.dismiss();
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
