import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigsService } from '../../../common/services/configs.service';
import { OnboardingStepName } from '../onboarding-v3.service';
import { OnboardingV3PanelService } from '../panel/onboarding-panel.service';
import { OnboardingV3ModalProgressService } from '../modal/onboarding-modal-progress.service';

/**
 * a component that has a saveAsync
 */
export interface AwaitablePanelComponent {
  saveAsync: () => Promise<any>;
}

/**
 * Onboarding modal component; core function as a connector,
 * and to switch between child panels.
 */
@Component({
  selector: 'm-onboardingProgress',
  templateUrl: './onboarding-modal.component.html',
  styleUrls: ['./onboarding-modal.component.ng.scss'],
})
export class OnboardingV3ModalComponent implements OnDestroy, OnInit {
  private subscriptions: Subscription[] = [];

  public cdnAssetsUrl: string;

  /**
   * Dismiss intent.
   */
  onDismissIntent: () => void = () => {};

  /**
   * Save intent.
   */
  onSaveIntent: (step: OnboardingStepName, stepData?: any) => void = () => {};

  /**
   * Panel with an async save function that can be called before resuming modal dismissal.
   */
  @ViewChild('awaitablePanel') awaitablePanel: AwaitablePanelComponent;

  constructor(
    private panel: OnboardingV3PanelService,
    private inProgressService: OnboardingV3ModalProgressService,
    private configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.panel.forceComplete$.subscribe((step: OnboardingStepName) => {
        if (this.currentStep$.getValue() && step) this.onSaveIntent(step);
      }),
      this.panel.dismiss$.subscribe((dismiss) => {
        if (this.currentStep$.getValue() && dismiss) {
          this.onDismissIntent();
          this.panel.dismiss$.next(false);
        }
      })
    );
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Sets modal options.
   * @param onDismissIntent - set dismiss intent callback.
   */
  setModalData({ onDismissIntent, onSaveIntent }) {
    this.onDismissIntent = onDismissIntent || (() => {});
    this.onSaveIntent = onSaveIntent || (() => {});
  }

  /**
   * Subject containing true if in progress
   */
  get inProgress$(): BehaviorSubject<boolean> {
    return this.inProgressService.inProgress$;
  }

  /**
   * Gets current step from service.
   * @returns { BehaviorSubject<OnboardingStepName> } - onboarding step name.
   */
  get currentStep$(): BehaviorSubject<OnboardingStepName> {
    return this.panel.currentStep$;
  }

  /**
   * Observable containing CSS object for banner src -
   * if none present makes height shorter.
   * @returns { Observable<object> } - css object intended for consumption by an ngStyle.
   */
  get bannerSrc$(): Observable<object> {
    return this.currentStep$.pipe(
      map((currentStep: string): object => {
        return currentStep === 'SuggestedHashtagsStep' ||
          currentStep === 'WelcomeStep'
          ? {
              backgroundImage: `url('${this.cdnAssetsUrl}assets/photos/confetti-concert-colors.jpg')`,
            }
          : {
              height: '100px',
            };
      })
    );
  }

  /**
   * Observable determining whether banner should be shown.
   * @returns { Observable<boolean> } - true if banner should be shown.
   */
  get showBanner$(): Observable<boolean> {
    return this.currentStep$.pipe(
      map((currentStep: string): boolean => {
        return (
          currentStep === 'SuggestedHashtagsStep' ||
          currentStep === 'WelcomeStep'
        );
      })
    );
  }

  /**
   * Observable determining whether footer should be shown.
   * @returns { Observable<boolean> } - true if footer should be shown.
   */
  get showFooter$(): Observable<boolean> {
    return this.currentStep$.pipe(
      map((currentStep: string): boolean => {
        return (
          currentStep !== 'VerifyUniquenessStep' &&
          currentStep !== 'VerifyPhoneStep' &&
          currentStep !== 'VerifyBankStep'
        );
      })
    );
  }

  /**
   * Gets from panel service whether progress should be disabled.
   * @returns { Observable<boolean> } - true if progress should be disabled.
   */
  get disabled$(): Observable<boolean> {
    return this.panel.disableProgress$;
  }

  /**
   * Triggered on next click. Calls panel to determine next step or action.
   * @returns { Promise<void> } - awaitable.
   */
  public async nextClicked(): Promise<void> {
    let stepData;
    try {
      if (
        this.awaitablePanel &&
        typeof this.awaitablePanel.saveAsync === 'function'
      ) {
        stepData = await this.awaitablePanel.saveAsync();
      }
      if (!this.inProgressService.inProgress$.getValue()) {
        this.onSaveIntent(this.currentStep$.getValue(), stepData);
        this.panel.nextStep();
      }
    } catch (e) {
      console.error(e);
    }
  }
}
