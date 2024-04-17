import { Injectable, Injector } from '@angular/core';
import { DateRangeModalComponent } from './date-range-modal.component';
import { FeedFilterDateRange } from '../feed-filter/feed-filter.component';
import { ModalService } from '../../../services/ux/modal.service';

@Injectable()
export class DateRangeModalService {
  /**
   * Constructor
   * @param modalService
   */
  constructor(protected modalService: ModalService) {}

  /**
   * Presents the date range modal
   * @param injector
   */
  pick(injector: Injector): Promise<FeedFilterDateRange> {
    const modal = this.modalService.present(DateRangeModalComponent, {
      data: {
        onApply: (dateRange) => {
          modal.close(dateRange);
        },
      },
      injector,
    });

    return modal.result;
  }
}
