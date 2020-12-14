import { Compiler, Injectable, Injector, OnDestroy } from '@angular/core';
import { BehaviorSubject, of, Subject, Subscription } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { ApiService } from '../../common/api/api.service';

import {
  StackableModalEvent,
  StackableModalService,
  StackableModalState,
} from '../../services/ux/stackable-modal.service';

import { OnboardingV3ModalComponent } from './modal/onboarding-modal.component';

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
<<<<<<< HEAD
export const RELEASED_STEPS: OnboardingGroup[] = ['InitialOnboardingGroup'];
=======
export const RELEASED_GROUPS: OnboardingGroup[] = ['InitialOnboardingGroup'];
>>>>>>> 31f09bfcd171c8d6086207e6924aa94011f4139d

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
   * Steps that will not trigger endpoint reload.
   */
  public readonly loadOverrideSteps = ['SetupChannelStep'];

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
    private compiler: Compiler,
    private injector: Injector,
    private stackableModal: StackableModalService,
    private api: ApiService
  ) {}

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Lazy load modules and open modal.
   * @returns { Promise<any> }
   */
  public async open(): Promise<any> {
    const { OnboardingV3ProgressLazyModule } = await import(
      './onboarding.lazy.module'
    );

    const moduleFactory = await this.compiler.compileModuleAsync(
      OnboardingV3ProgressLazyModule
    );
    const moduleRef = moduleFactory.create(this.injector);

    const componentFactory = moduleRef.instance.resolveComponent();

    const onSuccess$: Subject<any> = new Subject();

    const evt: StackableModalEvent = await this.stackableModal
      .present(OnboardingV3ModalComponent, null, {
        wrapperClass: 'm-modalV2__wrapper',
        dismissOnRouteChange: false,
        onSaveIntent: (step: OnboardingStepName) => {
          if (this.loadOverrideSteps.indexOf(step) > -1) {
            this.forceCompletion(step);
          }
        },
        onDismissIntent: () => {
          this.dismiss();
        },
      })
      .toPromise();

    // Modal was closed.
    if (evt.state === StackableModalState.Dismissed && !onSuccess$.isStopped) {
      throw 'DismissedModalException';
    }

    return onSuccess$.toPromise();
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
          map(progress =>
            progress.steps.map((progressStep: OnboardingStep) => {
              if (step === progressStep.id) {
                progressStep.is_completed = true;
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
    try {
      await this.open();
    } catch (e) {
      if (e === 'DismissedModalException') {
        return; // modal dismissed, do nothing
      }
      console.error(e);
    }
  }

  /**
   * Dismiss the modal.
   * @returns { void }
   */
  public dismiss(): void {
    try {
      this.stackableModal.dismiss();
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
