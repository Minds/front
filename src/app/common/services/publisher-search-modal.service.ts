import { Injectable, Injector } from '@angular/core';
import { PublisherSearchModalComponent } from '../components/publisher-search-modal/publisher-search-modal.component';
import { ModalService } from '../../services/ux/modal.service';

@Injectable()
export class PublisherSearchModalService {
  /**
   * Constructor
   * @param overlayModal
   */
  constructor(protected modalService: ModalService) {}

  /**
   * Presents the publisher search modal
   * @param injector
   */
  pick(injector: Injector, publisher: any): Promise<string> {
    const modal = this.modalService.present(PublisherSearchModalComponent, {
      data: {
        publisher,
        onSearch: (query) => modal.close(query),
      },
      injector,
    });

    return modal.result;
  }
}
