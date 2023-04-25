import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ToasterService } from '../../../common/services/toaster.service';
import { BoostModalData, BoostModalPanel } from './boost-modal-v2.types';
import { BoostModalV2Service } from './services/boost-modal-v2.service';
import { BoostGoalsExperimentService } from '../../experiments/sub-services/boost-goals-experiment.service';

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
  public readonly activePanel$: BehaviorSubject<BoostModalPanel> = this.service
    .activePanel$;

  // subscriptions.
  private saveIntentSubscription: Subscription;

  constructor(
    private service: BoostModalV2Service,
    private toast: ToasterService,
    private boostGoalsExperiment: BoostGoalsExperimentService
  ) {}

  ngOnInit(): void {
    if (!this.boostGoalsExperiment.isActive()) {
      this.activePanel$.next(BoostModalPanel.AUDIENCE);
    }

    this.saveIntentSubscription = this.service.callSaveIntent$.subscribe(
      onSaveIntent => {
        this.onSaveIntent();
      }
    );
  }

  ngOnDestroy(): void {
    this.saveIntentSubscription?.unsubscribe();
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
