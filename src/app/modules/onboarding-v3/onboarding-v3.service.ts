import { Injectable, Injector, OnDestroy } from '@angular/core';
import { BehaviorSubject, of, Subject, Subscription } from 'rxjs';
import { catchError, filter, map, skip, take } from 'rxjs/operators';
import { ApiService } from '../../common/api/api.service';

import { OnboardingV3ModalComponent } from './modal/onboarding-modal.component';
import { ModalService } from '../../services/ux/modal.service';
import { EmailConfirmationService } from '../../common/components/email-confirmation/email-confirmation.service';
import { DiscoveryTagsService } from '../discovery/tags/tags.service';

/**
 * GET api/v3/onboarding response.
 */
export type OnboardingResponse = {
  status: string;
  id?: OnboardingGroup;
  completed_pct?: number;
  is_completed?: boolean;
  steps?: OnboardingStep[];
} | null;

/**
 * Individual onboarding steps.
 */
export type OnboardingStep = {
  id: OnboardingStepName;
  is_completed: boolean;
};

/**
 * Names of different onboarding steps.
 */
export type OnboardingStepName =
  | 'SuggestedHashtagsStep'
  | 'WelcomeStep'
  | 'VerifyEmailStep'
  | 'SetupChannelStep'
  | 'VerifyUniquenessStep'
  | 'VerifyPhoneStep'
  | 'VerifyBankStep'
  | 'VerifyWalletStep'
  | 'CreatePostStep';

/**
 * Onboarding groups - possible ids returned from api/v3/onboarding
 */
export type OnboardingGroup =
  | 'InitialOnboardingGroup'
  | 'OngoingOnboardingGroup';

/**
 * Groups that the front-end has support for.
 */
export const RELEASED_GROUPS: OnboardingGroup[] = ['InitialOnboardingGroup'];

/**
 * Core service for onboarding v3 for loading
 * progress and opening the modal.
 */
@Injectable({
  providedIn: 'root',
})
export class OnboardingV3Service implements OnDestroy {
  private subscriptions: Subscription[] = [];

  /*
   * Holds response of progress that can be loaded using load().
   */
  public readonly progress$: BehaviorSubject<
    OnboardingResponse
  > = new BehaviorSubject<OnboardingResponse>(null);

  /**
   * True if object is completed
   */
  public readonly completed$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   * True if still loading
   */
  public readonly loading$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  constructor(
    private injector: Injector,
    private modalService: ModalService,
    private api: ApiService,
    private emailConfirmation: EmailConfirmationService,
    private tagsService: DiscoveryTagsService
  ) {
    this.subscriptions.push(
      this.emailConfirmation.success$
        .pipe(filter(Boolean), take(1))
        .subscribe(async success => {
          if (!(await this.tagsService.hasSetTags())) {
            this.open();
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
   * Lazy load modules and open modal.
   * @param { Function } onLoadFinished called when the onboarding api call is finished and we have the results
   * @returns { Promise<OnboardingStepName> } the completed step
   */
  public async open(onLoadFinished?: () => void): Promise<any> {
    const { OnboardingV3ProgressLazyModule } = await import(
      './onboarding.lazy.module'
    );

    const modal = this.modalService.present(OnboardingV3ModalComponent, {
      data: {
        onSaveIntent: (step: OnboardingStepName, stepData: any) => {
          if (step) {
            switch (step) {
              case 'SetupChannelStep':
                // only force complete if the channel had a bio (possibly make this more robust by applying more filters)
                if (stepData?.briefdescription && stepData?.name) {
                  this.forceCompletion(step);
                  this.completed$.next(true);
                  onLoadFinished?.();
                }
                this.load().then(onLoadFinished);
                break;
              default:
                // force complete and get the onboarding progress from api
                this.forceCompletion(step);
                this.completed$.next(true);
                onLoadFinished?.();
                this.load().then(onLoadFinished);
            }
          }
          modal.close(step);
        },
      },
      injector: this.injector,
      lazyModule: OnboardingV3ProgressLazyModule,
    });

    return modal.result;
  }

  /**
   * Manually set a steps state to complete -
   * override that will be wiped by next load if the server has not yet updated.
   * @param { OnboardingStepName } step - the step name to strike through.
   * @returns { void }
   */
  public forceCompletion(step: OnboardingStepName): void {
    this.subscriptions.push(
      this.progress$
        .pipe(
          take(1),
          catchError((e: any) => {
            console.error(e);
            return of(e);
          }),
          map((progress: OnboardingResponse) =>
            progress.steps.map((progressStep: OnboardingStep) => {
              if (step === progressStep.id && !progressStep.is_completed) {
                progressStep.is_completed = true;
                progress.completed_pct =
                  progress.completed_pct + 1 / progress.steps.length;
              }
            })
          )
        )
        .subscribe()
    );
  }

  /**
   * Present initial modals to be shown before navigation
   * to newsfeed.
   * @returns { Promise<void> } - awaitable.
   */
  public async presentHomepageModals(): Promise<void> {
    await this.open();
  }

  /**
   * Dismiss the modal.
   * @returns { void }
   */
  public dismiss(): void {
    try {
      this.modalService.dismissAll();
    } catch (e) {
      // do nothing
    }
  }

  /**
   * Get onboarding progress to the server
   * and pass it to the progress$ Observable.
   * @returns { Promise<void> } - awaitable.
   */
  public async load(): Promise<void> {
    this.subscriptions.push(
      this.api
        .get('/api/v3/onboarding')
        .pipe(
          take(1),
          catchError(e => {
            console.error(e);
            this.loading$.next(false);
            return of(null);
          })
        )
        .subscribe((progress: OnboardingResponse) => {
          this.progress$.next(progress);
          this.loading$.next(false);
        })
    );
  }
}
