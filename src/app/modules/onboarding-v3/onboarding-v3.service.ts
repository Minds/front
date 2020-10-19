import { Compiler, Injectable, Injector, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ApiService } from '../../common/api/api.service';
import {
  StackableModalEvent,
  StackableModalService,
  StackableModalState,
} from '../../services/ux/stackable-modal.service';
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
  | 'VerifyEmailStep'
  | 'SuggestedHashtagsStep'
  | 'SetupChannelStep'
  | 'VerifyUniquenessStep'
  | 'CreatePostStep';

@Injectable()
export class OnboardingV3Service {
  public progress$: Observable<OnboardingResponse> = new Observable<
    OnboardingResponse
  >(null);

  OnboardingV3ModalComponent;
  constructor(
    private compiler: Compiler,
    private injector: Injector,
    private stackableModal: StackableModalService,
    private api: ApiService
  ) {}

  public load() {
    this.progress$ = this.api.get('/api/v3/onboarding');
    this.progress$.pipe(take(1)).subscribe(progress => {
      if (progress.status === 'success') {
        for (let i = 0; i < progress.steps.length; i++) {
          if (!progress.steps[i].is_completed) {
          }
          console.log(progress.steps[i]);
        }
      }
      console.log(progress);
    });
  }

  public async open(step: StepName = 'SuggestedHashtagsStep'): Promise<any> {
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
          this.stackableModal.dismiss();
        },
      })
      .toPromise();

    // Modal was closed before login completed
    if (evt.state === StackableModalState.Dismissed && !onSuccess$.isStopped) {
      throw 'DismissedModalException';
    }

    return onSuccess$.toPromise();
  }
}

/**
 * {
"status": "success",
"id": "InitialOnboardingGroup",
"completed_pct": 0,
"is_completed": false,
"steps": [
  {
    "id": "VerifyEmailStep",
    "is_completed": false
  },
  {
    "id": "SuggestedHashtagsStep",
    "is_completed": false
  },
  {
    "id": "SetupChannelStep",
    "is_completed": false
  },
  {
      "id": "VerifyUniquenessStep",
      "is_completed": false
    },
    {
      "id": "CreatePostStep",
      "is_completed": false
    }
  ]
}
 */
