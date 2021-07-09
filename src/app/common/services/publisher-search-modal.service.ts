import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { OverlayModalService } from '../../services/ux/overlay-modal';
import { PublisherSearchModalComponent } from '../components/publisher-search-modal/publisher-search-modal.component';

@Injectable()
export class PublisherSearchModalService {
  /**
   * Constructor
   * @param overlayModal
   */
  constructor(protected overlayModal: OverlayModalService) {}

  /**
   * Presents the languages modal
   * @param injector
   */
  present(injector: Injector, publisher: any): Observable<string> {
    return new Observable<string>(subscriber => {
      const data = {
        publisher: publisher,
      };

      let open = true;

      this.overlayModal
        .create(
          PublisherSearchModalComponent,
          data,
          {
            wrapperClass: 'm-modalV2__wrapper',
            onSearch: query => {
              subscriber.next(query);
              this.overlayModal.dismiss();
            },
            onDismissIntent: () => {
              this.overlayModal.dismiss();
            },
          },
          injector
        )
        .onDidDismiss(() => {
          open = false;
          subscriber.complete();
        })
        .present();

      return () => {
        if (open) {
          this.overlayModal.dismiss();
        }
      };
    });
  }
}
