import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ToasterService } from '../../../common/services/toaster.service';
import {
  BoostModalData,
  BoostModalPanel,
  BoostSubject,
} from './boost-modal-v2.types';
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
export class BoostModalV2Component implements OnInit, OnDestroy {
  // enums.
  public BoostModalPanel: typeof BoostModalPanel = BoostModalPanel;

  // currently active panel.
  public readonly activePanel$: BehaviorSubject<BoostModalPanel> =
    this.service.activePanel$;

  // subscriptions.
  private subscriptions: Subscription[] = [];

  constructor(
    private service: BoostModalV2Service,
    private toast: ToasterService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.service.callSaveIntent$.subscribe((onSaveIntent) => {
        this.onSaveIntent();
      }),
      this.service.firstPanel$.subscribe((firstPanel: BoostModalPanel) => {
        if (
          firstPanel === BoostModalPanel.GOAL ||
          firstPanel === BoostModalPanel.BUDGET
        ) {
          this.activePanel$.next(firstPanel);
        }
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

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
  public setModalData({
    onDismissIntent,
    onSaveIntent,
    entity,
    disabledSafeAudience,
  }: BoostModalData) {
    this.onDismissIntent = onDismissIntent ?? (() => {});
    this.onSaveIntent = onSaveIntent ?? (() => {});

    // if an entity is nsfw, it cannot be boosted - reset and close modal.
    if (entity['nsfw']?.length > 0 || entity['nsfw_lock']?.length > 0) {
      this.toast.error('NSFW content cannot be boosted.');
      this.onDismissIntent();
      return;
    }

    if (disabledSafeAudience) {
      this.service.disabledSafeAudience$.next(disabledSafeAudience);
    }

    this.service.entity$.next(entity ?? null);
  }
}
