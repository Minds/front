import { Injectable } from '@angular/core';
import { ContentGenerationCompletedModalComponent } from './content-generation-completed-modal.component';
import {
  ModalRef,
  ModalService,
} from '../../../../../services/ux/modal.service';

/**
 * Content generation completed modal service.
 */
@Injectable({ providedIn: 'root' })
export class ContentGenerationCompletedModalService {
  constructor(private modalService: ModalService) {}

  /**
   * Open modal.
   * @returns { Promise<ModalRef<ContentGenerationCompletedModalComponent>> }
   */
  public async open(): Promise<
    ModalRef<ContentGenerationCompletedModalComponent>
  > {
    const modal = this.modalService.present(
      ContentGenerationCompletedModalComponent,
      {
        data: {
          onSaveIntent: () => {
            modal.close();
          },
          onDismissIntent: () => {
            modal.close();
          },
        },
        size: 'md',
      }
    );
    return modal;
  }
}
