import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BoostModalData, BoostModalPanel } from './boost-modal-v2.types';
import { BoostModalV2Service } from './services/boost-modal-v2.service';

/**
 * Boost modal v2 root level component.
 */
@Component({
  selector: 'm-boostModalV2',
  templateUrl: './boost-modal-v2.component.html',
  styleUrls: ['boost-modal-v2.component.ng.scss'],
  providers: [BoostModalV2Service],
})
export class BoostModalV2Component {
  // enums.
  public BoostModalPanel: typeof BoostModalPanel = BoostModalPanel;

  // currently active panel.
  public readonly activePanel$: BehaviorSubject<BoostModalPanel> = this.service
    .activePanel$;

  constructor(private service: BoostModalV2Service) {}

  /**
   * Dismiss intent.
   */
  onDismissIntent: () => void = () => {};

  /**
   * Save intent.
   */
  onSaveIntent: () => void = () => {};

  /**
   * Set modal data.
   * @param { BoostModalData } data - data for boost modal
   */
  setModalData({ onDismissIntent, onSaveIntent, entity }: BoostModalData) {
    this.onDismissIntent = onDismissIntent ?? (() => {});
    this.onSaveIntent = onSaveIntent ?? (() => {});
    this.service.entity$.next(entity ?? null);
  }
}
