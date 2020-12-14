import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import {
  OnboardingResponse,
  OnboardingV3Service,
  OnboardingStepName,
  OnboardingStep,
  RELEASED_GROUPS,
} from '../onboarding-v3.service';
import { OnboardingV3PanelService } from '../panel/onboarding-panel.service';
import { ModalService } from '../../composer/components/modal/modal.service';
import { ComposerService } from '../../composer/services/composer.service';
import { FormToastService } from '../../../common/services/form-toast.service';
import { OnboardingV3StorageService } from '../onboarding-storage.service';
import { catchError, take, tap } from 'rxjs/operators';

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

  /**
   * If true, widget is hidden.
   */
  public hidden = false;

  constructor(
    private onboarding: OnboardingV3Service,
    private panel: OnboardingV3PanelService,
    private onboardingStorage: OnboardingV3StorageService,
    private composerModal: ModalService,
    private injector: Injector,
    private toast: FormToastService
  ) {}

  ngOnInit(): void {
    // if should hide, hide and return
    if (this.shouldHide()) {
      this.completed$.next(true);
      return;
    }

    // if should collapse, collapse and return
    if (this.shouldCollapse()) {
      this.collapsed = true;
      return;
    }

    // else load
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
    try {
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
                  this.toast.inform(
                    this.isStepComplete(step, progress)
                      ? 'Your email address has already been confirmed.'
                      : 'Check your inbox for a verification email from us.'
                  );
                  break;
                case 'CreatePostStep':
                  this.composerModal
                    .setInjector(this.injector)
                    .present()
                    .toPromise()
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
                // else, default
                default:
                  this.panel.currentStep$.next(step);
                  try {
                    await this.onboarding.open();
                  } catch (e) {
                    if (e === 'DismissedModalException') {
                      return;
                    }
                    console.error(e);
                  }
                  break;
              }
            })
          )
          .subscribe()
      );
    } catch (e) {
      if (e === 'DismissedModalException') {
        this.checkCompletion();
        if (this.onboarding.loadOverrideSteps.indexOf(step) === -1) {
          this.onboarding.load();
        }
        return;
      }
      console.error(e);
    }
  }

  /**
   * Called when hide or show is clicked.
   * @param { 'show' | 'hide' } - one of 'show' or 'hide'.
   * @returns { void }
   */
  public onHideClick(option: 'show' | 'hide'): void {
    if (option === 'hide') {
      this.collapsed = true;
      this.onboardingStorage.set('onboarding:widget:collapsed');
      return;
    }
    if (option === 'show') {
      this.collapsed = false;
      this.onboarding.load();
      this.onboardingStorage.destroy('onboarding:widget:collapsed');
      return;
    }
  }

  /**
   * Determines whether body of panel should be collapsed.
   * @returns { boolean } true if should be hidden.
   */
  private shouldCollapse(): boolean {
    return this.onboardingStorage.hasNotExpired('onboarding:widget:collapsed');
  }

  /**
   * Determines whether widget should be hidden.
   * @returns { boolean } true if should be hidden.
   */
  private shouldHide(): boolean {
    return this.onboardingStorage.hasNotExpired('onboarding:widget:completed');
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
              this.onboardingStorage.set('onboarding:widget:completed'); // expires 3 days
              this.completed$.next(true);
              return;
            }

            // if is completed.
            if (progress.is_completed) {
              this.onboardingStorage.set('onboarding:widget:completed'); // expires 3 days
              this.completed$.next(true);
            }

            // filter out not-completed steps.
            const completedSteps = this.getCompletedSteps(progress);

            // if all steps are completed, lengths will be the same.
            if (completedSteps.length === progress.steps.length) {
              this.onboardingStorage.set('onboarding:widget:completed'); // expires 3 days
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
}
