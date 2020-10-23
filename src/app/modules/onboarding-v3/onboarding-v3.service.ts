import { Compiler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

import {
  StackableModalEvent,
  StackableModalService,
  StackableModalState,
} from '../../services/ux/stackable-modal.service';

import { AuthModalService } from '../auth/modal/auth-modal.service';
import { OnboardingV3ModalComponent } from './modal/onboarding-modal.component';

export type OnboardingResponse = {
  status: string;
  id?: string;
  completed_pct?: number;
  is_completed?: boolean;
  steps?: OnboardingStep[];
} | null;

export type OnboardingStep = {
  id: StepName;
  is_completed: boolean;
};

export type StepName =
  | 'SuggestedHashtagsStep'
  | 'WelcomeStep'
  | 'VerifyEmailStep'
  | 'SetupChannelStep'
  | 'VerifyUniquenessStep'
  | 'VerifyPhoneStep'
  | 'VerifyBankStep'
  | 'VerifyWalletStep'
  | 'CreatePostStep';

@Injectable()
export class OnboardingV3Service {
  constructor(
    private compiler: Compiler,
    private injector: Injector,
    private stackableModal: StackableModalService,
    private authModal: AuthModalService
  ) {}

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
        // formDisplay: opts.formDisplay,
        onComplete: (complete: boolean) => {
          onSuccess$.next(complete);
          onSuccess$.complete(); // Ensures promise can be called below
          this.stackableModal.dismiss();
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

  public async presentHomepageModals(): Promise<void> {
    try {
      await this.authModal.open();
      await this.open();
    } catch (e) {
      if (e === 'DismissedModalException') {
        return; // modal dismissed, do nothing
      }
      console.error(e);
    }
  }

  public dismiss() {
    this.stackableModal.dismiss();
  }

  // TODO: Implement for sidebar widget
  // public load() {
  //   this.progress$ = this.api.get('/api/v3/onboarding');
  //   this.progress$.pipe(take(1)).subscribe(progress => {
  //     if (progress.status === 'success') {
  //       for (let i = 0; i < progress.steps.length; i++) {
  //         if (!progress.steps[i].is_completed) {
  //         }
  //         console.log(progress.steps[i]);
  //       }
  //     }
  //     console.log(progress);
  //   });
  // }
}
