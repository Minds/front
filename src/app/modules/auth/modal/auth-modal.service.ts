import { Injectable, Compiler, Injector } from '@angular/core';
import {
  StackableModalService,
  StackableModalEvent,
  StackableModalState,
} from '../../../services/ux/stackable-modal.service';
import { AuthModalComponent } from './auth-modal.component';
import { Subject, combineLatest, Observable, concat, merge } from 'rxjs';
import { MindsUser } from '../../../interfaces/entities';
import { FeaturesService } from '../../../services/features.service';
import { OnboardingV3Service } from '../../onboarding-v3/onboarding-v3.service';
import { OnboardingV3PanelService } from '../../onboarding-v3/panel/onboarding-panel.service';

@Injectable()
export class AuthModalService {
  constructor(
    private compiler: Compiler,
    private injector: Injector,
    private stackableModal: StackableModalService,
    private features: FeaturesService,
    private onboardingV3: OnboardingV3Service,
    private onboardingV3Panel: OnboardingV3PanelService
  ) {}

  async open(
    opts: { formDisplay: string } = { formDisplay: 'register' }
  ): Promise<MindsUser> {
    const { AuthModalModule } = await import('./auth-modal.module');

    const moduleFactory = await this.compiler.compileModuleAsync(
      AuthModalModule
    );
    const moduleRef = moduleFactory.create(this.injector);

    const componentFactory = moduleRef.instance.resolveComponent();

    const onSuccess$: Subject<MindsUser> = new Subject();

    const evt: StackableModalEvent = await this.stackableModal
      .present(AuthModalComponent, null, {
        wrapperClass: 'm-modalV2__wrapper',
        formDisplay: opts.formDisplay,
        onComplete: (user: MindsUser) => {
          onSuccess$.next(user);
          onSuccess$.complete(); // Ensures promise can be called below
          this.stackableModal.dismiss();

          if (
            this.features.has('onboarding-october-2020') &&
            opts.formDisplay === 'register'
          ) {
            this.onboardingV3Panel.currentStep$.next('SuggestedHashtagsStep');
            this.onboardingV3.open();
          }
        },
        onDismissIntent: () => {
          this.stackableModal.dismiss();
        },
      })
      .toPromise();

    // Modal was closed before login completed
    if (evt.state === StackableModalState.Dismissed && !onSuccess$.isStopped) {
      throw 'Dismissed modal';
    }

    return onSuccess$.toPromise();
  }
}
