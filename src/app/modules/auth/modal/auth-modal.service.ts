import { Injectable, Injector } from '@angular/core';
import { AuthModalComponent } from './auth-modal.component';
import { MindsUser } from '../../../interfaces/entities';
import { Session } from '../../../services/session';
import { ModalService } from '../../../services/ux/modal.service';
import { EmailCodeExperimentService } from '../../experiments/sub-services/email-code-experiment.service';
import { OnboardingV4Service } from '../../onboarding-v4/onboarding-v4.service';

@Injectable()
export class AuthModalService {
  constructor(
    private injector: Injector,
    private modalService: ModalService,
    private session: Session,
    private emailCodeExperiment: EmailCodeExperimentService,
    private onboardingV4Service: OnboardingV4Service
  ) {}

  async open(
    opts: { formDisplay: string } = { formDisplay: 'register' }
  ): Promise<MindsUser> {
    if (this.session.isLoggedIn()) {
      return this.session.getLoggedInUser();
    }

    const { AuthModalModule } = await import('./auth-modal.module');

    const modal = this.modalService.present(AuthModalComponent, {
      data: {
        formDisplay: opts.formDisplay,
        onComplete: async (user: MindsUser) => {
          modal.close(user);

          if (
            opts.formDisplay === 'register' &&
            !this.emailCodeExperiment.isActive()
          ) {
            this.onboardingV4Service.startOnboarding();
          }
        },
      },
      keyboard: false,
      injector: this.injector,
      lazyModule: AuthModalModule,
    });

    return modal.result;
  }
}
