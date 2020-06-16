import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { LanguageModalComponent } from './language-modal.component';
import { OverlayModalService } from '../../../services/ux/overlay-modal';

@Injectable()
export class LanguageModalService {
  /**
   * Constructor
   * @param overlayModal
   */
  constructor(protected overlayModal: OverlayModalService) {}

  /**
   * Presents the languages modal
   * @param injector
   */
  present(injector: Injector): Observable<string> {
    return new Observable<string>(subscriber => {
      let open = true;

      this.overlayModal
        .create(
          LanguageModalComponent,
          null,
          {
            wrapperClass: 'm-modalV2__wrapper',
            onSave: language => {
              subscriber.next(language);
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
