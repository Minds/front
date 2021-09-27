import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { DateRangeModalComponent } from '../date-range-modal/date-range-modal.component';
import { FeedFilterDateRange } from '../feed-filter/feed-filter.component';

@Injectable()
export class DateRangeModalService {
  /**
   * Constructor
   * @param overlayModal
   */
  constructor(protected overlayModal: OverlayModalService) {}

  /**
   * Presents the languages modal
   * @param injector
   */
  present(injector: Injector): Observable<FeedFilterDateRange> {
    return new Observable<FeedFilterDateRange>(subscriber => {
      let open = true;

      this.overlayModal
        .create(
          DateRangeModalComponent,
          null,
          {
            wrapperClass: 'm-modalV2__wrapper',
            onApply: dateRange => {
              subscriber.next(dateRange);
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
