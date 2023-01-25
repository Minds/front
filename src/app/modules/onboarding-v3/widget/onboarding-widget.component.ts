import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import {
  OnboardingResponse,
  OnboardingStep,
  OnboardingStepName,
  OnboardingV3Service,
  RELEASED_GROUPS,
} from '../onboarding-v3.service';
import { OnboardingV3PanelService } from '../panel/onboarding-panel.service';
import { ComposerModalService } from '../../composer/components/modal/modal.service';
import { ComposerService } from '../../composer/services/composer.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { catchError, take, tap } from 'rxjs/operators';
import { EmailResendService } from '../../../common/services/email-resend.service';
import { OnboardingFeedNoticesExperimentService } from '../../experiments/sub-services/onboarding-feed-notices-experiment.service';
import { VerifyUniquenessModalLazyService } from '../../verify-uniqueness/modal/services/verify-uniqueness-modal.service';
import { InAppVerificationExperimentService } from '../../experiments/sub-services/in-app-verification-experiment.service';

/**
 * Onboarding widget that tracks user progress through onboarding.
 */
@Component({
  selector: 'm-onboardingProgressWidget',
  templateUrl: './onboarding-widget.component.html',
  styleUrls: ['./onboarding-widget.component.ng.scss'],
  providers: [ComposerService],
})
export class OnboardingV3WidgetComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  /**
   * If true, widget will be collapsed.
   */
  public collapsed = false;

  /**
   * If true, all steps are completed.
   */
  public completed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  // hidden when feed notice experiment is active.
  public noticeExperimentActive: boolean = false;

  constructor(
    private onboarding: OnboardingV3Service,
    private panel: OnboardingV3PanelService,
    private composerModal: ComposerModalService,
    private injector: Injector,
    private toast: ToasterService,
    private emailResend: EmailResendService,
    private verifyUniquenessModal: VerifyUniquenessModalLazyService,
    private noticeExperiment: OnboardingFeedNoticesExperimentService,
    private inAppVerificationExperimentService: InAppVerificationExperimentService
  ) {}

  ngOnInit(): void {
    this.noticeExperimentActive = this.noticeExperiment.isActive();

    if (this.noticeExperimentActive) {
      return; // no need to load if experiment is active.
    }

    // load onboarding progress from server.
    this.onboarding.load();

    // on progress change (reload from server), check completion.
    this.subscriptions.push(
      this.progress$.subscribe(progress => {
        // catches after completed local storage is no longer valid
        this.checkCompletion();
      })
    );
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Get progress response from the service.
   * @returns Observable<OnboardingResponse> - response from the service.
   */
  get progress$(): Observable<OnboardingResponse> {
    return this.onboarding.progress$;
  }

  /**
   * Get loading boolean from the service.
   * Used to prevent component showing on load for users who are have completed.
   * @returns Observable<boolean> - response from the service.
   */
  get loading$(): Observable<boolean> {
    return this.onboarding.loading$;
  }

  /**
   * Called when a task is clicked by the user.
   * @param { OnboardingStepName } - the clicked step.
   * @returns { Promise<void> } - awaitable.
   */
  public async onTaskClick(step: OnboardingStepName): Promise<void> {
    this.subscriptions.push(
      this.progress$
        .pipe(
          take(1),
          catchError((err: any) => {
            console.error(err);
            return of(null);
          }),
          tap(async (progress: OnboardingResponse) => {
            switch (step) {
              case 'VerifyEmailStep':
                if (this.isStepComplete(step, progress)) {
                  this.toast.inform(
                    'Your email address has already been confirmed.'
                  );
                  break;
                }
                this.resendEmailConfirmation(); // async
                break;
              case 'CreatePostStep':
                this.composerModal
                  .setInjector(this.injector)
                  .present()
                  .then(response => {
                    // if activity posted, manually strike through task.
                    if (response) {
                      this.onboarding.forceCompletion('CreatePostStep');
                      this.checkCompletion();
                    }
                  });
                break;
              case 'VerifyUniquenessStep':
                if (this.isStepComplete(step, progress)) {
                  this.toast.inform('You have already completed this step');
                  break;
                }

                if (this.inAppVerificationExperimentService.isActive()) {
                  await this.verifyUniquenessModal.open();
                  break;
                }
              // else, default
              default:
                this.panel.currentStep$.next(step);
                await this.onboarding.open(() => this.checkCompletion());
                break;
            }
          })
        )
        .subscribe()
    );
  }

  /**
   * Called when hide or show is clicked.
   * @param { 'show' | 'hide' } - one of 'show' or 'hide'.
   * @returns { void }
   */
  public onHideClick(option: 'show' | 'hide'): void {
    if (option === 'hide') {
      this.collapsed = true;
      return;
    }
    if (option === 'show') {
      this.collapsed = false;
      this.onboarding.load();
      return;
    }
  }

  /**
   * Checks the completion of this group - when adding additional groups extend here.
   * If completed; sets local storage item with 3 day expiry (check for new released stages).
   * Also sets completed to true which is used to hide the widget.
   * @returns { void }
   */
  private checkCompletion(): void {
    this.subscriptions.push(
      this.progress$
        .pipe(
          take(1),
          catchError(e => {
            console.error(e);
            return of(e);
          }),
          tap((progress: OnboardingResponse) => {
            // catch initial load
            if (!progress) {
              return;
            }

            // if step is not released - set completed.
            if (RELEASED_GROUPS.indexOf(progress.id) === -1) {
              this.completed$.next(true);
              return;
            }

            // if is completed.
            if (progress.is_completed) {
              this.completed$.next(true);
            }

            // filter out not-completed steps.
            const completedSteps = this.getCompletedSteps(progress);

            // if all steps are completed, lengths will be the same.
            if (completedSteps.length === progress.steps.length) {
              this.completed$.next(true);
              return;
            }
          })
        )
        .subscribe()
    );
  }

  /**
   * Get all completed steps.
   * @param { OnboardingResponse } progress - progress.
   * @returns { OnboardingStep[] } array of completed onboarding steps.
   */
  private getCompletedSteps(progress: OnboardingResponse): OnboardingStep[] {
    return progress.steps.filter((progressStep: OnboardingStep) => {
      return progressStep.is_completed;
    });
  }

  /**
   * Determines whether or not a step is complete.
   * @param { OnboardingStepName } stepName - step name.
   * @param { OnboardingResponse } progress - progress.
   */
  private isStepComplete(
    stepName: OnboardingStepName,
    progress: OnboardingResponse
  ) {
    return (
      this.getCompletedSteps(progress)
        .map(step => {
          return step.id;
        })
        .indexOf(stepName) !== -1
    );
  }

  /**
   * Attempts to resend email confirmation with a 30 second rate limit.
   * @returns { Promise<boolean> } - async
   */
  private async resendEmailConfirmation(): Promise<void> {
    this.emailResend.send();
  }
}
