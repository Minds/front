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
import { Session } from '../../../services/session';

@Injectable()
export class AuthModalService {
  constructor(
    private compiler: Compiler,
    private injector: Injector,
    private stackableModal: StackableModalService,
    private features: FeaturesService,
    private onboardingV3: OnboardingV3Service,
    private session: Session
  ) {}

  async open(
    opts: { formDisplay: string } = { formDisplay: 'register' }
  ): Promise<MindsUser> {
    if (this.session.isLoggedIn()) {
      return this.session.getLoggedInUser();
    }

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
        onComplete: async (user: MindsUser) => {
          onSuccess$.next(user);
          onSuccess$.complete(); // Ensures promise can be called below
          this.stackableModal.dismiss();

          if (
            this.features.has('onboarding-october-2020') &&
            opts.formDisplay === 'register'
          ) {
            try {
              await this.onboardingV3.open();
            } catch (e) {
              if (e === 'DismissedModalException') {
                return; // modal dismissed, do nothing
              }
            }
          }
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
