import { Compiler, Injectable, Injector } from '@angular/core';
import { BehaviorSubject, of, Subject, Subscription } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { ApiService } from '../../common/api/api.service';

import {
  StackableModalEvent,
  StackableModalService,
  StackableModalState,
} from '../../services/ux/stackable-modal.service';

import { OnboardingV3ModalComponent } from './modal/onboarding-modal.component';

/**
 * api/v3/onboarding response
 */
export type OnboardingResponse = {
  status: string;
  id?: string;
  completed_pct?: number;
  is_completed?: boolean;
  steps?: OnboardingStep[];
} | null;

/**
 * Individual onboarding steps
 */
export type OnboardingStep = {
  id: OnboardingStepName;
  is_completed: boolean;
};

/**
 * Names of different onboarding steps
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
 * Core service for onboarding v3 for loading
 * progress and opening the modal.
 */
@Injectable({
  providedIn: 'root',
})
export class OnboardingV3Service {
  private subscriptions: Subscription[] = [];

  /*
   * Holds response of progress that can be loaded using load().
   */
  public readonly progress$: BehaviorSubject<
    OnboardingResponse
  > = new BehaviorSubject<OnboardingResponse>(null);

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
        onComplete: (complete: boolean) => {
          onSuccess$.next(complete);
          onSuccess$.complete(); // Ensures promise can be called below
          this.dismiss();
        },
        onDismissIntent: () => {
          this.dismiss();
        },
      })
      .toPromise();

    // Modal was closed before login completed
    if (evt.state === StackableModalState.Dismissed && !onSuccess$.isStopped) {
      throw 'DismissedModalException';
    }

    return onSuccess$.toPromise();
  }

  /**
   * Present initial modals to be shown before navigation
   * to newsfeed.
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
   * Dismiss the modal
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
   */
  public load(): void {
    this.subscriptions.push(
      this.api
        .get('/api/v3/onboarding')
        .pipe(
          take(1),
          catchError(e => {
            console.error(e);
            return of(null);
          })
        )
        .subscribe((progress: OnboardingResponse) => {
          this.progress$.next(progress);
        })
    );
  }
}
