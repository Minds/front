import { Injectable, Injector } from '@angular/core';
import { LanguageModalComponent } from './language-modal.component';
import { ModalService } from '../../../services/ux/modal.service';

@Injectable()
export class LanguageModalService {
  /**
   * Constructor
   * @param modalService
   */
  constructor(protected modalService: ModalService) {}

  /**
   * Presents the languages modal
   * @param injector
   */
  present(injector: Injector): Promise<string> {
    const modal = this.modalService.present(LanguageModalComponent, {
      data: {
        onSave: (language) => modal.close(language),
      },
      injector,
    });

    return modal.result;
  }
}
