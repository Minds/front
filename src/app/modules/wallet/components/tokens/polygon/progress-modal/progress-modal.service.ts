import { Injectable, Input } from '@angular/core';
import {
  StackableModalService,
  StackableModalEvent,
} from '../../../../../../services/ux/stackable-modal.service';
import { HistoryRecord } from '../polygon.types';
import { PolygonProgressModalComponent } from './progress-modal.component';

@Injectable({ providedIn: 'root' })
export class ProgressModalService {
  constructor(private stackableModal: StackableModalService) {}

  /**
   * Open network swap bridge modal
   * @returns { StackableModalEvent }
   */
  public async open(): Promise<StackableModalEvent> {
    return this.stackableModal
      .present(PolygonProgressModalComponent, null, {
        wrapperClass: 'm-modalV2__wrapper',
        onComplete: () => {
          this.stackableModal.dismiss();
        },
        onDismissIntent: () => {
          this.stackableModal.dismiss();
        },
      })
      .toPromise();
  }
}
